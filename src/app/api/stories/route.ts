import { NextResponse } from "next/server";
import { CURRENT_USER, MOCK_USERS } from "@/lib/mock-data";

export async function GET() {
  const stories = [
    { username: CURRENT_USER.username, seed: "current", isOwn: true },
    ...MOCK_USERS.slice(0, 8).map((u) => ({
      username: u.username,
      seed: u.username,
      isOwn: false,
    })),
  ];

  return NextResponse.json(stories);
}
