import { NextRequest, NextResponse } from "next/server";
import { MOCK_REELS } from "@/lib/mock-data";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const reel = MOCK_REELS.find((r) => r.id === id);

  if (!reel) {
    return NextResponse.json({ error: "Reel not found" }, { status: 404 });
  }

  reel.isLiked = !reel.isLiked;
  reel.likesCount += reel.isLiked ? 1 : -1;

  return NextResponse.json({ isLiked: reel.isLiked, likesCount: reel.likesCount });
}
