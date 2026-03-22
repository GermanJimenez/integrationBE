"use client";

import { useState } from "react";
import Link from "next/link";
import { Reel } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/utils";

interface Props {
  reel: Reel;
}

export default function ReelCard({ reel }: Props) {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likesCount, setLikesCount] = useState(reel.likesCount);

  async function handleLike() {
    const prevLiked = isLiked;
    const prevLikes = likesCount;

    setIsLiked((v) => !v);
    setLikesCount((v) => (isLiked ? v - 1 : v + 1));

    try {
      const res = await fetch(`/api/reels/${reel.id}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to toggle reel like");
      const data: { isLiked: boolean; likesCount: number } = await res.json();
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevLikes);
    }
  }

  return (
    <div className="relative h-full w-full bg-black rounded-xl overflow-hidden snap-start flex-shrink-0" style={{ width: 320, height: 568 }}>
      {/* Thumbnail / video placeholder */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={reel.thumbnailUrl}
        alt={reel.caption}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      {/* Play button hint */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60">
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Right action bar */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <svg
            viewBox="0 0 24 24"
            fill={isLiked ? "#ef4444" : "none"}
            stroke={isLiked ? "#ef4444" : "white"}
            strokeWidth={2}
            className="w-7 h-7"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <span className="text-white text-xs font-medium">{likesCount.toLocaleString()}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
          </svg>
          <span className="text-white text-xs font-medium">{reel.commentsCount.toLocaleString()}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          <span className="text-white text-xs font-medium">Share</span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-4 left-3 right-14">
        <Link href={`/profile/${reel.author.username}`} className="flex items-center gap-2 mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={reel.author.avatar}
            alt={reel.author.username}
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
          />
          <span className="text-white font-semibold text-sm">{reel.author.username}</span>
          <span className="text-white/60 text-xs">{formatDistanceToNow(reel.createdAt)}</span>
        </Link>
        <p className="text-white text-sm leading-snug line-clamp-2">{reel.caption}</p>
        {reel.audioTrack && (
          <div className="flex items-center gap-1 mt-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
            </svg>
            <span className="text-white/80 text-xs truncate">{reel.audioTrack}</span>
          </div>
        )}
        <p className="text-white/60 text-xs mt-1">{reel.viewsCount.toLocaleString()} views</p>
      </div>
    </div>
  );
}
