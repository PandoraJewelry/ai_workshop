import { NextResponse } from "next/server";
import { getAllAgents } from "@/lib/agents";

export async function GET() {
  const agents = getAllAgents().map((agent) => ({
    id: agent.id,
    name: agent.name,
    icon: agent.icon,
    description: agent.description,
  }));

  return NextResponse.json({ agents });
}
