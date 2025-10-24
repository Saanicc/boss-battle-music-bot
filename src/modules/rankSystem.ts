import { rankEmoji } from "../utils/constants/emojis";

export interface Rank {
  minLevel: number;
  title: string;
}

export const RANKS: Rank[] = [
  { minLevel: 25, title: `${rankEmoji.grandmaster} Grandmaster DJ` },
  { minLevel: 20, title: `${rankEmoji.elite} Elite Mixer` },
  { minLevel: 15, title: `${rankEmoji.pro} Pro Beatmaker` },
  { minLevel: 10, title: `${rankEmoji.specialist} Sound Specialist` },
  { minLevel: 5, title: `${rankEmoji.rising} Rising DJ` },
  { minLevel: 3, title: `${rankEmoji.enthusiast} Beat Enthusiast` },
  { minLevel: 1, title: `${rankEmoji.listener} Listener` },
];

export const getRankTitle = (level: number): string => {
  const rank = RANKS.find((r) => level >= r.minLevel);
  return rank ? rank.title : RANKS[RANKS.length - 1].title;
};
