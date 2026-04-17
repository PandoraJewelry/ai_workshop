"use client";

import type { SourceReference } from "@/types";

type SourceListProps = {
  sources: SourceReference[];
};

export function SourceList({ sources }: SourceListProps) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">
        Sources
      </p>
      <div className="space-y-1">
        {sources.map((source, index) => (
          <div
            key={`${source.repo}-${index}`}
            className="flex items-start gap-2 text-[12px] text-gray-500"
          >
            <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono text-gray-600 flex-shrink-0">
              {source.repo}
            </span>
            <span className="truncate font-mono text-[11px]">
              {source.filePath}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
