import { NextRequest, NextResponse } from "next/server";
import { CURRENT_USER, MOCK_USERS } from "@/lib/mock-data";

const FOLLOW_STATE = new Set<string>();
const FOLLOWER_COUNTS = new Map<string, number>();

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (username === CURRENT_USER.username) {
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
  }

  const currentlyFollowing = FOLLOW_STATE.has(username);

  if (currentlyFollowing) {
    FOLLOW_STATE.delete(username);
  } else {
    FOLLOW_STATE.add(username);
  }

  const profile = MOCK_USERS.find((u) => u.username === username);
  const baseFromProfile = profile?.followersCount ?? 0;
  const base = FOLLOWER_COUNTS.get(username) ?? baseFromProfile;
  const nextCount = currentlyFollowing ? Math.max(0, base - 1) : base + 1;
  FOLLOWER_COUNTS.set(username, nextCount);

  return NextResponse.json({
    isFollowing: !currentlyFollowing,
    followersCount: nextCount,
  });
}
