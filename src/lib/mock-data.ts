// ============================================================
// MOCK DATA — Fakestagram
//
// This file simulates the data that would come from a real
// backend API. Students should replace these mocks with actual
// API calls once the backend integration is complete.
//
//  (students): When integrating with the real backend,
//   remove this file and update /src/lib/api.ts to make
//   real HTTP requests instead of returning mock data.
// ============================================================

import { User, Post, Reel, Conversation, Comment } from "@/lib/types";

// ── Users ────────────────────────────────────────────────────

export const CURRENT_USER: User = {
  id: "u_current",
  username: "yourhandle",
  name: "Your Name",
  avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=current",
  bio: "📸 Photography enthusiast | ☕ Coffee lover | 🌍 World traveler",
  website: "https://yourwebsite.com",
  followersCount: 1_204,
  followingCount: 843,
  postsCount: 10,
  isVerified: false,
};

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    username: "alex.photo",
    name: "Alex Rivera",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=alex",
    bio: "Street photographer 📷 | NYC",
    followersCount: 12_300,
    followingCount: 540,
    postsCount: 87,
    isVerified: true,
  },
  {
    id: "u2",
    username: "maya.art",
    name: "Maya Chen",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=maya",
    bio: "Digital artist ✨ | Commissions open",
    followersCount: 45_780,
    followingCount: 210,
    postsCount: 234,
    isVerified: false,
  },
  {
    id: "u3",
    username: "javier.cooks",
    name: "Javier López",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=javier",
    bio: "🍳 Chef & food blogger | Madrid",
    followersCount: 8_900,
    followingCount: 1_200,
    postsCount: 156,
    isVerified: false,
  },
  {
    id: "u4",
    username: "sofia.travels",
    name: "Sofia Müller",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=sofia",
    bio: "🌍 50+ countries | Travel content creator",
    followersCount: 230_000,
    followingCount: 3_400,
    postsCount: 892,
    isVerified: true,
  },
  {
    id: "u5",
    username: "kai.fitness",
    name: "Kai Johnson",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=kai",
    bio: "💪 Personal trainer | HIIT & strength",
    followersCount: 67_200,
    followingCount: 890,
    postsCount: 441,
    isVerified: false,
  },
];

// ── Helper to build comments ──────────────────────────────────

function mockComments(count: number, postId: string): Comment[] {
  const templates = [
    "This is absolutely stunning! 😍",
    "Love this so much! ❤️",
    "Incredible shot 🔥",
    "Goals! Saving this for later ✨",
    "You never disappoint 👏",
    "This made my day 🌟",
    "Obsessed with this content!",
    "Wow, the vibes here are immaculate 💫",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `comment_${postId}_${i}`,
    author: MOCK_USERS[i % MOCK_USERS.length],
    text: templates[i % templates.length],
    createdAt: new Date(Date.now() - i * 600_000).toISOString(),
    likesCount: Math.floor(Math.random() * 40),
  }));
}

// ── Posts ────────────────────────────────────────────────────

// Picsum gives us deterministic placeholder images by seed
const IMAGE_SEEDS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const CAPTIONS = [
  "Golden hour never gets old 🌅 #photography #nature",
  "Exploring hidden gems in the city. Every alley tells a story. 🏙️",
  "Sunday brunch vibes ☕🥞 Tag someone you'd bring here!",
  "Mountains were calling and I went 🏔️ #hiking #adventure",
  "Studio session 🎨 New piece dropping this Friday — stay tuned!",
  "Markets, colors, and chaos — the perfect weekend 🌈",
  "Late night run through the city lights 🌃 #urban #nightphotography",
  "Fresh from the kitchen 🍝 Recipe in bio!",
  "Chasing sunsets across the coast 🌊 #travel #ocean",
  "New work in progress… details soon 🔮 #art #creative",
];

export const MOCK_POSTS: Post[] = IMAGE_SEEDS.map((seed, i) => ({
  id: `post_${i + 1}`,
  author: MOCK_USERS[i % MOCK_USERS.length],
  imageUrl: `https://picsum.photos/seed/${seed}/600/600`,
  caption: CAPTIONS[i],
  likesCount: 120 + i * 47,
  commentsCount: 3 + i,
  createdAt: new Date(Date.now() - i * 3_600_000).toISOString(),
  comments: mockComments(Math.min(3, i + 1), `post_${i + 1}`),
  isLiked: i % 3 === 0,
  isSaved: i % 5 === 0,
  location: ["New York", "Tokyo", "Barcelona", "Sydney", "Cape Town"][i % 5],
}));

// ── Reels ────────────────────────────────────────────────────

const REEL_CAPTIONS = [
  "Morning routine 🌅 5am club vibes",
  "Street food tour in Bangkok 🇹🇭🍜",
  "30-day transformation complete 💪 #fitness",
  "Portrait editing in 60 seconds ✨ #photography",
  "Pacific coast drive 🌊 windows down, no plans",
  "NYC at night — a visual poem 🌆",
  "Plant-based bowl from scratch 🥗 recipe in bio",
  "Skate session downtown 🛹 #skateboarding",
  "Timelapse: painting a mural in 2 hours 🎨",
  "Golden retriever's first beach day 🐕🏖️",
];

const AUDIO_TRACKS = [
  "Blinding Lights — The Weeknd",
  "Golden Hour — JVKE",
  "Flowers — Miley Cyrus",
  "Anti-Hero — Taylor Swift",
  "As It Was — Harry Styles",
  "Creepin' — Metro Boomin",
  "Kill Bill — SZA",
  "Shakira: Bzrp Session 53",
  "Unholy — Sam Smith",
  "Escapism — RAYE",
];

export const MOCK_REELS: Reel[] = Array.from({ length: 10 }, (_, i) => ({
  id: `reel_${i + 1}`,
  author: MOCK_USERS[i % MOCK_USERS.length],
  // These are placeholder thumbnail images — real videos would come from UploadThing
  videoUrl: `https://picsum.photos/seed/reel${i + 1}/400/700`,
  thumbnailUrl: `https://picsum.photos/seed/reel${i + 1}/400/700`,
  caption: REEL_CAPTIONS[i],
  likesCount: 500 + i * 123,
  commentsCount: 20 + i * 7,
  viewsCount: 5_000 + i * 1_337,
  createdAt: new Date(Date.now() - i * 7_200_000).toISOString(),
  isLiked: i % 4 === 0,
  audioTrack: AUDIO_TRACKS[i],
}));

// ── Direct Messages / Conversations ──────────────────────────

function buildConversation(user: User, messages: { text: string; fromMe: boolean; minsAgo: number }[]): Conversation {
  const dms = messages.map((m, i) => ({
    id: `msg_${user.id}_${i}`,
    senderId: m.fromMe ? CURRENT_USER.id : user.id,
    text: m.text,
    createdAt: new Date(Date.now() - m.minsAgo * 60_000).toISOString(),
    isRead: m.minsAgo > 5,
  }));

  return {
    id: `conv_${user.id}`,
    participant: user,
    messages: dms,
    lastMessage: dms[dms.length - 1],
    unreadCount: dms.filter((m) => !m.isRead && m.senderId !== CURRENT_USER.id).length,
  };
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  buildConversation(MOCK_USERS[0], [
    { text: "Hey! Loved your last post 📸", fromMe: false, minsAgo: 60 },
    { text: "Thanks so much! Took ages to edit 😅", fromMe: true, minsAgo: 55 },
    { text: "What camera do you shoot with?", fromMe: false, minsAgo: 50 },
    { text: "Sony A7IV, can't recommend it enough 🙌", fromMe: true, minsAgo: 45 },
    { text: "Adding it to my wishlist right now 😂", fromMe: false, minsAgo: 3 },
  ]),
  buildConversation(MOCK_USERS[1], [
    { text: "Your art style is incredible ✨", fromMe: true, minsAgo: 120 },
    { text: "Thank you!! I've been working on a new series", fromMe: false, minsAgo: 115 },
    { text: "Can't wait to see it! When does it drop?", fromMe: true, minsAgo: 110 },
    { text: "Friday! Stay tuned 🎨", fromMe: false, minsAgo: 2 },
  ]),
  buildConversation(MOCK_USERS[2], [
    { text: "Made your pasta recipe last night 🍝", fromMe: true, minsAgo: 200 },
    { text: "How did it turn out??", fromMe: false, minsAgo: 195 },
    { text: "Absolutely amazing. My family loved it!", fromMe: true, minsAgo: 190 },
    { text: "That makes me so happy to hear 🥹", fromMe: false, minsAgo: 185 },
    { text: "Sending you a follow for sure!", fromMe: true, minsAgo: 180 },
  ]),
  buildConversation(MOCK_USERS[3], [
    { text: "Which country is your favourite so far?", fromMe: true, minsAgo: 300 },
    { text: "Impossible to pick just one 😭 Japan is top 3 for sure", fromMe: false, minsAgo: 290 },
    { text: "Any hidden gems you recommend?", fromMe: true, minsAgo: 280 },
    { text: "Kanazawa in Japan — completely underrated!", fromMe: false, minsAgo: 10 },
  ]),
  buildConversation(MOCK_USERS[4], [
    { text: "Your workout videos are so motivating!", fromMe: false, minsAgo: 500 },
    { text: "That's exactly why I make them! Keep going 💪", fromMe: true, minsAgo: 490 },
    { text: "Started the 30-day challenge today", fromMe: false, minsAgo: 480 },
    { text: "Let's gooo!! Tag me in your progress posts!", fromMe: true, minsAgo: 475 },
    { text: "Day 1 done! Already dying 😂", fromMe: false, minsAgo: 4 },
  ]),
  buildConversation(MOCK_USERS[0], [
    { text: "Collaboration idea?", fromMe: false, minsAgo: 720 },
    { text: "I'm all ears!", fromMe: true, minsAgo: 710 },
  ]),
  buildConversation(MOCK_USERS[1], [
    { text: "Check out my new portfolio site!", fromMe: false, minsAgo: 1440 },
    { text: "Wow, it looks amazing! Love the layout 🔥", fromMe: true, minsAgo: 1430 },
  ]),
  buildConversation(MOCK_USERS[2], [
    { text: "New recipe coming this week 🍕", fromMe: false, minsAgo: 2880 },
    { text: "Already drooling 🤤", fromMe: true, minsAgo: 2875 },
  ]),
  buildConversation(MOCK_USERS[3], [
    { text: "Just landed in Patagonia 🏔️", fromMe: false, minsAgo: 4320 },
    { text: "JEALOUS. Enjoy every second!", fromMe: true, minsAgo: 4310 },
  ]),
  buildConversation(MOCK_USERS[4], [
    { text: "New program launching next month!", fromMe: false, minsAgo: 5760 },
    { text: "Hyped! Send me the early access link when it's up", fromMe: true, minsAgo: 5750 },
  ]),
];

// ── Current user's posts (for profile) ───────────────────────

export const CURRENT_USER_POSTS: Post[] = IMAGE_SEEDS.slice(0, 10).map((seed, i) => ({
  id: `my_post_${i + 1}`,
  author: CURRENT_USER,
  imageUrl: `https://picsum.photos/seed/my${seed}/600/600`,
  caption: CAPTIONS[i],
  likesCount: 40 + i * 12,
  commentsCount: 2 + i,
  createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
  comments: mockComments(2, `my_post_${i + 1}`),
  isLiked: false,
  isSaved: false,
}));
