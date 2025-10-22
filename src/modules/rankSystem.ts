export interface Rank {
  minLevel: number;
  title: string;
}

export const RANKS: Rank[] = [
  { minLevel: 25, title: "🏆 Grandmaster DJ" },
  { minLevel: 20, title: "👑 Elite Mixer" },
  { minLevel: 15, title: "🔥 Pro Beatmaker" },
  { minLevel: 10, title: "💿 Sound Specialist" },
  { minLevel: 5, title: "🎚️ Rising DJ" },
  { minLevel: 3, title: "🎵 Beat Enthusiast" },
  { minLevel: 1, title: "🎧 Listener" },
];

export const getRankTitle = (level: number): string => {
  const rank = RANKS.find((r) => level >= r.minLevel);
  return rank ? rank.title : RANKS[RANKS.length - 1].title;
};
