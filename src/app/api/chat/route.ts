import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAgent } from "@/lib/agents";
import { getDevinClient } from "@/lib/devin-client";
import { getMockResponse } from "@/lib/mock-responses";
import {
  createConversation,
  getConversation,
  addMessage,
} from "@/lib/conversation-store";
import { checkRateLimit } from "@/lib/rate-limiter";
import type { Message, ChatRequest, FunctionCall, SourceReference } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { question, agentId, conversationId } = body;

    if (!question || !agentId) {
      return NextResponse.json(
        { error: "Missing required fields: question, agentId" },
        { status: 400 }
      );
    }

    const agent = getAgent(agentId);
    if (!agent) {
      return NextResponse.json(
        { error: `Unknown agent: ${agentId}` },
        { status: 400 }
      );
    }

    // Rate limiting (using a placeholder user ID for now)
    const userId = "market-user-1";
    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          resetAt: rateLimit.resetAt,
        },
        { status: 429 }
      );
    }

    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };

    // Get or create conversation
    let activeConversationId = conversationId;
    if (conversationId) {
      const existing = getConversation(conversationId);
      if (existing) {
        addMessage(conversationId, userMessage);
      } else {
        activeConversationId = undefined;
      }
    }

    if (!activeConversationId) {
      const conversation = createConversation(agentId, userMessage);
      activeConversationId = conversation.id;
    }

    // Try Devin API first, fall back to mock responses
    let answer: string;
    let functionCalls: FunctionCall[];
    let sources: SourceReference[];

    const devinClient = getDevinClient();

    if (devinClient) {
      // Live Devin mode
      const searchCall: FunctionCall = {
        name: "search_codebase",
        args: { query: question, domain: agent.domainFilter.join(", ") },
        result: "Searching...",
        status: "running",
      };

      try {
        const result = await devinClient.askQuestion(
          agent.systemPrompt,
          question
        );
        answer = result.answer;
        functionCalls = [
          {
            ...searchCall,
            result: `Session: ${result.sessionUrl}`,
            status: "success",
          },
        ];
        sources = [
          {
            repo: "Devin Session",
            filePath: result.sessionUrl,
            summary: "Live code analysis via Devin",
          },
        ];
      } catch {
        // Fall back to mock if Devin fails
        const mockResult = getMockResponse(agentId, question);
        answer = mockResult.answer;
        functionCalls = mockResult.functionCalls;
        sources = mockResult.sources;
      }
    } else {
      // Mock/demo mode
      const mockResult = getMockResponse(agentId, question);
      answer = mockResult.answer;
      functionCalls = mockResult.functionCalls;
      sources = mockResult.sources;
    }

    // Create assistant message
    const assistantMessage: Message = {
      id: uuidv4(),
      role: "assistant",
      content: answer,
      timestamp: new Date().toISOString(),
      functionCalls,
    };

    addMessage(activeConversationId, assistantMessage);

    return NextResponse.json({
      answer,
      conversationId: activeConversationId,
      functionCalls,
      sources,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
