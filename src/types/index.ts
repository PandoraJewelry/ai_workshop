export type AgentId = "loyalty" | "promotions" | "content";

export type Agent = {
  id: AgentId;
  name: string;
  icon: string;
  description: string;
  systemPrompt: string;
  domainFilter: string[];
};

export type FunctionCall = {
  name: string;
  args: Record<string, string>;
  result: string;
  status: "running" | "success" | "error";
};

export type MessageRole = "user" | "assistant";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  functionCalls?: FunctionCall[];
};

export type Conversation = {
  id: string;
  title: string;
  agentId: AgentId;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

export type ChatRequest = {
  question: string;
  agentId: AgentId;
  conversationId?: string;
};

export type ChatResponse = {
  answer: string;
  conversationId: string;
  functionCalls: FunctionCall[];
  sources: SourceReference[];
};

export type SourceReference = {
  repo: string;
  filePath: string;
  lineRange?: [number, number];
  summary: string;
};

export type UserRole = "market-viewer" | "market-admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
};
