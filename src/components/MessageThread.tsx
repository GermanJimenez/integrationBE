"use client";

import { useState, useRef, useEffect } from "react";
import { Conversation, DirectMessage } from "@/lib/types";
import { CURRENT_USER } from "@/lib/mock-data";
import { formatDistanceToNow } from "@/lib/utils";

interface Props {
  initialConversation: Conversation;
}

export default function MessageThread({ initialConversation }: Props) {
  const [messages, setMessages] = useState(initialConversation.messages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
  const [mediaName, setMediaName] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if ((!text.trim() && !mediaUrl) || sending) return;

    // Optimistic update — add message locally right away
    const optimistic: DirectMessage = {
      id: `msg_optimistic_${Date.now()}`,
      senderId: CURRENT_USER.id,
      text: text.trim(),
      mediaUrl,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");
    setMediaUrl(undefined);
    setMediaName("");
    setSending(true);

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: initialConversation.id,
          text: optimistic.text,
          mediaUrl: optimistic.mediaUrl,
        }),
      });
    } finally {
      setSending(false);
    }
  }

  async function handleMediaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setMediaUrl(reader.result);
        setMediaName(file.name);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={initialConversation.participant.avatar}
          alt={initialConversation.participant.username}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-sm">{initialConversation.participant.username}</p>
          <p className="text-xs text-gray-400">{initialConversation.participant.name}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {messages.map((msg) => {
          const isMe = msg.senderId === CURRENT_USER.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isMe
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}
              >
                <p>{msg.text}</p>
                {msg.mediaUrl && (
                  <a
                    href={msg.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block mt-1 underline ${isMe ? "text-blue-100" : "text-blue-600"}`}
                  >
                    Open attachment
                  </a>
                )}
                <p className={`text-xs mt-1 ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                  {formatDistanceToNow(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-3 px-4 py-3 border-t border-gray-200">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Attach file"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364L14.47 3.914a3 3 0 114.243 4.243L8.558 18.31a1.5 1.5 0 11-2.121-2.12l9.9-9.901" />
          </svg>
        </button>
        <input ref={fileRef} type="file" onChange={handleMediaChange} className="hidden" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={mediaName ? `Attached: ${mediaName}` : "Message…"}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={(!text.trim() && !mediaUrl) || sending}
          className="text-sm font-semibold text-blue-500 disabled:opacity-40"
        >
          {sending ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
