import { NextRequest } from "next/server";
import { POST as handleAgentPost } from "@/app/api/agent/route";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return handleAgentPost(req);
}
