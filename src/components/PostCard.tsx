"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/utils";

interface Props {
  post: Post;
}

export default function PostCard({ post: initial }: Props) {
  const [post, setPost] = useState(initial);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  async function handleLike() {
    const previous = post;

    // Optimistic update
    setPost((p) => ({
      ...p,
      isLiked: !p.isLiked,
      likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
    }));

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to toggle like");
      const data: { isLiked: boolean; likesCount: number } = await res.json();
      setPost((p) => ({ ...p, isLiked: data.isLiked, likesCount: data.likesCount }));
    } catch {
      setPost(previous);
    }
  }

  async function handleSave() {
    // Optimistic update
    setPost((p) => ({ ...p, isSaved: !p.isSaved }));

    await fetch(`/api/posts/${post.id}/save`, { method: "POST" });
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || commentLoading) return;

    setCommentLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText.trim() }),
      });
      if (!res.ok) throw new Error("Failed to comment");

      const data: { comment: Post["comments"][number] } = await res.json();
      setPost((p) => ({
        ...p,
        commentsCount: p.commentsCount + 1,
        comments: [...p.comments, data.comment],
      }));
      setCommentText("");
      setShowAllComments(true);
    } finally {
      setCommentLoading(false);
    }
  }

  return (
    <article className="bg-white border border-gray-200 rounded-xl overflow-hidden max-w-[468px] w-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href={`/profile/${post.author.username}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.author.avatar}
            alt={post.author.username}
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/profile/${post.author.username}`} className="font-semibold text-sm hover:underline">
            {post.author.username}
          </Link>
          {post.location && (
            <p className="text-xs text-gray-500">{post.location}</p>
          )}
        </div>
        <button className="text-gray-600" aria-label="More options">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={post.imageUrl} alt={post.caption} className="w-full aspect-square object-cover" />

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={handleLike} aria-label={post.isLiked ? "Unlike" : "Like"} className="transition-transform active:scale-110">
            <svg
              viewBox="0 0 24 24"
              fill={post.isLiked ? "#ef4444" : "none"}
              stroke={post.isLiked ? "#ef4444" : "currentColor"}
              strokeWidth={2}
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
          <button aria-label="Comment">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
          </button>
          <button aria-label="Share">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
          <button onClick={handleSave} aria-label={post.isSaved ? "Unsave" : "Save"} className="ml-auto">
            <svg
              viewBox="0 0 24 24"
              fill={post.isSaved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </button>
        </div>

        <p className="font-semibold text-sm mb-1">{post.likesCount.toLocaleString()} likes</p>

        <p className="text-sm">
          <Link href={`/profile/${post.author.username}`} className="font-semibold mr-1 hover:underline">
            {post.author.username}
          </Link>
          {post.caption}
        </p>

        {post.commentsCount > 2 && !showAllComments && (
          <button onClick={() => setShowAllComments(true)} className="text-sm text-gray-500 mt-1 hover:underline">
            View all {post.commentsCount} comments
          </button>
        )}

        {(showAllComments ? post.comments : post.comments.slice(0, 1)).map((c) => (
          <p key={c.id} className="text-sm mt-1">
            <Link href={`/profile/${c.author.username}`} className="font-semibold mr-1 hover:underline">
              {c.author.username}
            </Link>
            {c.text}
          </p>
        ))}

        <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">
          {formatDistanceToNow(post.createdAt)}
        </p>
      </div>

      {/* Comment input */}
      <form onSubmit={handleCommentSubmit} className="flex items-center gap-3 px-4 py-3 border-t border-gray-100">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
        </svg>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 text-sm outline-none bg-transparent"
        />
        <button
          type="submit"
          className="text-sm font-semibold text-blue-500 disabled:opacity-40"
          disabled={!commentText.trim() || commentLoading}
        >
          Post
        </button>
      </form>
    </article>
  );
}
