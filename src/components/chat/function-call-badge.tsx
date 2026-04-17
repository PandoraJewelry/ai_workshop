"use client";

import { CheckCircleIcon, LoaderIcon, CodeIcon } from "@/components/ui/icons";
import type { FunctionCall } from "@/types";

type FunctionCallBadgeProps = {
  functionCall: FunctionCall;
};

export function FunctionCallBadge({ functionCall }: FunctionCallBadgeProps) {
  const statusIcon =
    functionCall.status === "running" ? (
      <LoaderIcon size={12} />
    ) : functionCall.status === "success" ? (
      <CheckCircleIcon size={12} className="text-emerald-600" />
    ) : (
      <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
    );

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-medium text-emerald-800">
      <CodeIcon size={12} className="text-emerald-600" />
      <span>{functionCall.name}</span>
      {statusIcon}
    </div>
  );
}

type FunctionCallListProps = {
  functionCalls: FunctionCall[];
};

export function FunctionCallList({ functionCalls }: FunctionCallListProps) {
  if (functionCalls.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mb-2">
      {functionCalls.map((fc, index) => (
        <FunctionCallBadge key={`${fc.name}-${index}`} functionCall={fc} />
      ))}
    </div>
  );
}
