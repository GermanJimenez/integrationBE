"use client";

import { useEffect, useState } from "react";

interface Story {
  username: string;
  seed: string;
  isOwn: boolean;
}

const DEFAULT_STORIES: Story[] = [
  { username: "yourhandle", seed: "current", isOwn: true },
  { username: "alex.photo", seed: "alex", isOwn: false },
  { username: "maya.art", seed: "maya", isOwn: false },
  { username: "javier.cooks", seed: "javier", isOwn: false },
  { username: "sofia.travels", seed: "sofia", isOwn: false },
  { username: "kai.fitness", seed: "kai", isOwn: false },
];

export default function StoriesBar() {
  const [stories, setStories] = useState<Story[]>(DEFAULT_STORIES);

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stories");
        return res.json();
      })
      .then((data: Story[]) => {
        if (data.length > 0) setStories(data);
      })
      .catch(() => {
        // Keep default stories when the stories endpoint is unavailable.
      });
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide bg-white border border-gray-200 rounded-xl px-4 py-3">
      {stories.map(({ username, seed, isOwn }) => (
        <button key={username} className="flex flex-col items-center gap-1 flex-shrink-0">
          <div
            className={`w-14 h-14 rounded-full p-0.5 ${
              isOwn ? "bg-gray-200" : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
            }`}
          >
            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.dicebear.com/8.x/notionists/svg?seed=${seed}`}
                alt={username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {isOwn ? (
            <div className="relative -mt-5 ml-8 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth={3} strokeLinecap="round" />
              </svg>
            </div>
          ) : null}
          <span className="text-xs text-gray-500 truncate max-w-[56px]">
            {isOwn ? "Your story" : username.split(".")[0]}
          </span>
        </button>
      ))}
    </div>
  );
}
