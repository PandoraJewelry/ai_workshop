"use client";

import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Sidebar } from "@/components/layout/sidebar";
import { ChatArea } from "@/components/chat/chat-area";
import { ChatInput } from "@/components/chat/chat-input";
import type {
  AgentId,
  Message,
  Conversation,
  FunctionCall,
  SourceReference,
} from "@/types";

const agentList: {
  id: AgentId;
  name: string;
  icon: string;
  description: string;
}[] = [
  {
    id: "loyalty",
    name: "Loyalty",
    icon: "trophy",
    description: "Loyalty tiers, points, upgrade criteria",
  },
  {
    id: "promotions",
    name: "Promotions",
    icon: "gift",
    description: "Promotion logic, discounts, campaigns",
  },
  {
    id: "content",
    name: "Content",
    icon: "file-text",
    description: "CMS, translations, assets",
  },
];

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<AgentId>("promotions");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<SourceReference[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
    setSources([]);
  }, []);

  const handleSelectAgent = useCallback(
    (agentId: AgentId) => {
      setSelectedAgent(agentId);
      handleNewChat();
    },
    [handleNewChat]
  );

  const handleSelectConversation = useCallback(
    (id: string) => {
      const conv = conversations.find((c) => c.id === id);
      if (conv) {
        setActiveConversationId(id);
        setSelectedAgent(conv.agentId);
        setMessages(conv.messages);
        setSources([]);
      }
    },
    [conversations]
  );

  const handleSend = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: uuidv4(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setSources([]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: content,
            agentId: selectedAgent,
            conversationId: activeConversationId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const data: {
          answer: string;
          conversationId: string;
          functionCalls: FunctionCall[];
          sources: SourceReference[];
        } = await response.json();

        const assistantMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: data.answer,
          timestamp: new Date().toISOString(),
          functionCalls: data.functionCalls,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setSources(data.sources);

        // Update conversation tracking
        if (!activeConversationId) {
          setActiveConversationId(data.conversationId);
          const newConversation: Conversation = {
            id: data.conversationId,
            title:
              content.length > 60 ? content.slice(0, 57) + "..." : content,
            agentId: selectedAgent,
            messages: [userMessage, assistantMessage],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setConversations((prev) => [newConversation, ...prev]);
        } else {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConversationId
                ? {
                    ...c,
                    messages: [...c.messages, userMessage, assistantMessage],
                    updatedAt: new Date().toISOString(),
                  }
                : c
            )
          );
        }
      } catch {
        const errorMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your question. Please try again.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedAgent, activeConversationId]
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        agents={agentList}
        selectedAgent={selectedAgent}
        onSelectAgent={handleSelectAgent}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-gray-900">
              {agentList.find((a) => a.id === selectedAgent)?.name} Agent
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700">
              Hybrid Mode
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-100 text-gray-600">
              Read Only
            </span>
          </div>
        </header>

        {/* Chat Area */}
        <ChatArea
          messages={messages}
          sources={sources}
          isLoading={isLoading}
          agentId={selectedAgent}
        />

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          disabled={isLoading}
          placeholder={`Ask the ${agentList.find((a) => a.id === selectedAgent)?.name} agent...`}
        />
      </main>
    </div>
  );
}
