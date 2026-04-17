"use client";

import { UserIcon } from "@/components/ui/icons";
import { PandoraCrownIcon } from "@/components/ui/pandora-logo";
import { FunctionCallList } from "@/components/chat/function-call-badge";
import type { Message } from "@/types";

type ChatMessageProps = {
  message: Message;
};

function formatMarkdown(content: string): string {
  // Simple markdown to HTML conversion
  let html = content;

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Paragraphs (double newline)
  html = html.replace(/\n\n/g, "</p><p>");
  html = `<p>${html}</p>`;

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, "");

  return html;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 animate-fade-in-up ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-gray-200 text-gray-600"
            : "bg-[#e0007a] text-white"
        }`}
      >
        {isUser ? (
          <UserIcon size={16} />
        ) : (
          <PandoraCrownIcon size={18} />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`max-w-[75%] ${
          isUser
            ? "bg-gray-100 rounded-2xl rounded-tr-sm px-4 py-2.5"
            : "bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm"
        }`}
      >
        {/* Function calls (assistant only) */}
        {!isUser && message.functionCalls && message.functionCalls.length > 0 && (
          <FunctionCallList functionCalls={message.functionCalls} />
        )}

        {/* Message text */}
        {isUser ? (
          <p className="text-sm text-gray-800 leading-relaxed">
            {message.content}
          </p>
        ) : (
          <div
            className="markdown-content text-sm text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
          />
        )}

        {/* Timestamp */}
        <p className="text-[10px] text-gray-400 mt-1.5">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
