/**
 * Devin API Client
 *
 * Communicates with the Devin REST API (v3) to create sessions,
 * send messages, and poll for responses. Used as the "brain"
 * for answering Market team questions.
 *
 * API docs: https://docs.devin.ai/api-reference/overview
 */

const DEVIN_API_BASE = "https://api.devin.ai/v3";

type DevinSessionResponse = {
  session_id: string;
  url: string;
  status: string;
};

type DevinMessageResponse = {
  items: {
    message_id: string;
    role: string;
    content: string;
    created_at: number;
  }[];
};

type DevinSessionStatus = {
  session_id: string;
  status: string;
};

export class DevinClient {
  private apiKey: string;
  private orgId: string;

  constructor(apiKey: string, orgId: string) {
    this.apiKey = apiKey;
    this.orgId = orgId;
  }

  private get headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  private get baseUrl(): string {
    return `${DEVIN_API_BASE}/organizations/${this.orgId}`;
  }

  async createSession(prompt: string): Promise<DevinSessionResponse> {
    const response = await fetch(`${this.baseUrl}/sessions`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(
        `Devin API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async getSessionStatus(sessionId: string): Promise<DevinSessionStatus> {
    const response = await fetch(`${this.baseUrl}/sessions/${sessionId}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(
        `Devin API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async getSessionMessages(
    sessionId: string
  ): Promise<DevinMessageResponse> {
    const response = await fetch(
      `${this.baseUrl}/sessions/${sessionId}/messages`,
      {
        headers: this.headers,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Devin API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async sendMessage(sessionId: string, message: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({ message }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Devin API error: ${response.status} ${response.statusText}`
      );
    }
  }

  /**
   * Creates a session with a question and polls until an answer is available.
   * Returns the assistant's response content.
   */
  async askQuestion(
    agentPrompt: string,
    question: string,
    onFunctionCall?: (name: string, args: string) => void
  ): Promise<{ answer: string; sessionUrl: string }> {
    const fullPrompt = `${agentPrompt}\n\nUser question from Market team:\n${question}\n\nProvide a clear, non-technical answer. Cite specific files and functions where relevant. Format with markdown.`;

    const session = await this.createSession(fullPrompt);
    const sessionId = session.session_id;

    // Poll for completion
    const maxAttempts = 60; // 5 minutes max (5s intervals)
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const status = await this.getSessionStatus(sessionId);

      if (
        status.status === "exit" ||
        status.status === "error" ||
        status.status === "suspended"
      ) {
        break;
      }

      if (onFunctionCall) {
        onFunctionCall(
          "search_codebase",
          JSON.stringify({ status: status.status, attempt: i + 1 })
        );
      }
    }

    // Get the messages
    const messages = await this.getSessionMessages(sessionId);
    const assistantMessages = messages.items.filter(
      (m) => m.role === "assistant" || m.role === "devin"
    );

    const lastMessage =
      assistantMessages[assistantMessages.length - 1]?.content ||
      "I was unable to find an answer. Please try rephrasing your question.";

    return {
      answer: lastMessage,
      sessionUrl: session.url,
    };
  }
}

/**
 * Get the configured Devin client.
 * Falls back to mock mode if env vars are not set.
 */
export function getDevinClient(): DevinClient | null {
  const apiKey = process.env.DEVIN_API_KEY;
  const orgId = process.env.DEVIN_ORG_ID;

  if (!apiKey || !orgId) {
    return null;
  }

  return new DevinClient(apiKey, orgId);
}
