import { NextResponse } from "next/server";
import { listConversations } from "@/lib/conversation-store";

export async function GET() {
  const conversations = listConversations();
  return NextResponse.json({ conversations });
}
