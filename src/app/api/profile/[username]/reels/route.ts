import { NextRequest, NextResponse } from "next/server";
import { MOCK_REELS } from "@/lib/mock-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const reels = MOCK_REELS.filter((r) => r.author.username === username);

  return NextResponse.json(reels);
}
