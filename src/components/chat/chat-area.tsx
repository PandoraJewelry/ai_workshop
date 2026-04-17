"use client";

import { useRef, useEffect } from "react";
import { ChatMessage } from "@/components/chat/chat-message";
import { SourceList } from "@/components/chat/source-list";
import Image from "next/image";
import { SparklesIcon, LoaderIcon } from "@/components/ui/icons";
import type { Message, AgentId, SourceReference } from "@/types";

type ChatAreaProps = {
  messages: Message[];
  sources: SourceReference[];
  isLoading: boolean;
  agentId: AgentId;
};

const agentNameMap: Record<AgentId, string> = {
  loyalty: "Loyalty",
  promotions: "Promotions",
  content: "Content",
};

const agentDescriptionMap: Record<AgentId, string> = {
  loyalty:
    "Ask about loyalty tiers, points, upgrade criteria, and customer segmentation",
  promotions:
    "Ask about promotion logic, discount calculations, campaigns, and pricing rules",
  content:
    "Ask about CMS content types, translations, asset paths, and rendering",
};

const sampleQuestions: Record<AgentId, string[]> = {
  loyalty: [
    "How are loyalty tiers structured?",
    "What triggers a tier upgrade from Pink to Silver?",
    "How are customer groups used to segment promotions?",
    "Where is the loyalty check during checkout?",
  ],
  promotions: [
    "How is the Winter Sale promotion calculated?",
    "What is the EU 30-day lowest price rule?",
    "How do coupon-based promotions work?",
    "Where are promotion banners managed?",
  ],
  content: [
    "What content types exist in Amplience CMS?",
    "Where are translation strings stored?",
    "How many locales are supported?",
    "How does the hero-banner content type work?",
  ],
};

export function ChatArea({
  messages,
  sources,
  isLoading,
  agentId,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Background robot image - right side */}
      <div className="absolute bottom-0 right-0 pointer-events-none z-0 select-none overflow-hidden">
        <Image
          src="/pandora-robot-bg.png"
          alt=""
          width={800}
          height={450}
          className="w-[600px] h-auto opacity-[0.08]"
          aria-hidden="true"
        />
      </div>

      {isEmpty ? (
        /* Empty state / Welcome screen */
        <div className="h-full flex flex-col items-center justify-center px-6 relative z-10">
          <div className="max-w-lg text-center">
            <div className="w-14 h-14 bg-[#fce4f0] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SparklesIcon size={28} className="text-[#e0007a]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {agentNameMap[agentId]} Agent
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {agentDescriptionMap[agentId]}
            </p>

            {/* Sample questions */}
            <div className="grid grid-cols-2 gap-2">
              {sampleQuestions[agentId].map((question, index) => (
                <button
                  key={index}
                  className="text-left px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-600 hover:border-[#e0007a]/30 hover:bg-[#fce4f0] transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Messages */
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-5">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 animate-fade-in-up">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e0007a] text-white flex items-center justify-center">
                <SparklesIcon size={16} />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <LoaderIcon size={14} />
                  <span>Searching codebase...</span>
                </div>
              </div>
            </div>
          )}

          {/* Sources from last response */}
          {!isLoading && sources.length > 0 && (
            <div className="ml-11">
              <SourceList sources={sources} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
