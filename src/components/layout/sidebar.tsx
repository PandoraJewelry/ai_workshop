"use client";

import { Icon, PlusIcon, MessageSquareIcon } from "@/components/ui/icons";
import { PandoraLogo } from "@/components/ui/pandora-logo";
import type { AgentId, Conversation } from "@/types";

type SidebarProps = {
  agents: { id: AgentId; name: string; icon: string; description: string }[];
  selectedAgent: AgentId;
  onSelectAgent: (agentId: AgentId) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
};

export function Sidebar({
  agents,
  selectedAgent,
  onSelectAgent,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
}: SidebarProps) {
  const agentColorMap: Record<AgentId, string> = {
    loyalty: "bg-purple-100 text-purple-700 border-purple-200",
    promotions: "bg-amber-100 text-amber-700 border-amber-200",
    content: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const agentActiveColorMap: Record<AgentId, string> = {
    loyalty: "bg-purple-600 text-white border-purple-600",
    promotions: "bg-amber-600 text-white border-amber-600",
    content: "bg-blue-600 text-white border-blue-600",
  };

  return (
    <aside className="w-[280px] h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Pandora Logo & Title */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#e0007a] rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
            </svg>
          </div>
          <div>
            <PandoraLogo width={100} height={18} className="text-gray-900" />
            <p className="text-[11px] text-[#e0007a] font-medium mt-0.5">
              Market Help
            </p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e8e0dc] text-sm text-gray-700 hover:bg-[#fce4f0] hover:border-[#e0007a]/30 transition-colors"
        >
          <PlusIcon size={16} />
          New Chat
        </button>
      </div>

      {/* Agent Selector */}
      <div className="px-3 pb-2">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 px-1">
          Agents
        </p>
        <div className="space-y-1">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm border transition-all ${
                selectedAgent === agent.id
                  ? agentActiveColorMap[agent.id]
                  : `${agentColorMap[agent.id]} hover:opacity-80`
              }`}
            >
              <Icon name={agent.icon} size={16} />
              <div className="text-left">
                <div className="font-medium text-[13px]">{agent.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto px-3 pt-2 border-t border-gray-100">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2 px-1">
          Recent Chats
        </p>
        <div className="space-y-0.5">
          {conversations.length === 0 ? (
            <p className="text-xs text-gray-400 px-1 py-2">
              No conversations yet
            </p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] transition-colors ${
                  activeConversationId === conv.id
                    ? "bg-[#fce4f0] text-[#e0007a]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <MessageSquareIcon size={14} className="flex-shrink-0" />
                <span className="truncate">{conv.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* User section */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-7 h-7 bg-[#fce4f0] text-[#e0007a] rounded-full flex items-center justify-center text-xs font-medium">
            MK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-gray-800 truncate">
              Market Team
            </p>
            <p className="text-[11px] text-gray-400">Read Only</p>
          </div>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">
            Online
          </span>
        </div>
      </div>
    </aside>
  );
}
