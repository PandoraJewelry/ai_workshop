/**
 * In-memory conversation store.
 * In production, replace with PostgreSQL.
 */

import { v4 as uuidv4 } from "uuid";
import type { Conversation, Message, AgentId } from "@/types";

const conversations = new Map<string, Conversation>();

export function createConversation(
  agentId: AgentId,
  firstMessage: Message
): Conversation {
  const id = uuidv4();
  const now = new Date().toISOString();
  const title =
    firstMessage.content.length > 60
      ? firstMessage.content.slice(0, 57) + "..."
      : firstMessage.content;

  const conversation: Conversation = {
    id,
    title,
    agentId,
    messages: [firstMessage],
    createdAt: now,
    updatedAt: now,
  };

  conversations.set(id, conversation);
  return conversation;
}

export function getConversation(id: string): Conversation | undefined {
  return conversations.get(id);
}

export function addMessage(conversationId: string, message: Message): void {
  const conversation = conversations.get(conversationId);
  if (conversation) {
    conversation.messages.push(message);
    conversation.updatedAt = new Date().toISOString();
  }
}

export function listConversations(): Conversation[] {
  return Array.from(conversations.values())
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .map((c) => ({
      ...c,
      messages: [], // Don't return full messages in list view
    }));
}

export function getConversationMessages(id: string): Message[] {
  const conversation = conversations.get(id);
  return conversation?.messages ?? [];
}
