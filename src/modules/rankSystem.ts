import { ranks } from "../utils/constants/ranks";

export interface Rank {
  minLevel: number;
  title: string;
  titleWithEmoji: string;
  image: string;
}

export const RANKS: Rank[] = [
  {
    minLevel: 25,
    title: ranks.grandmaster.title,
    titleWithEmoji: `${ranks.grandmaster.emoji} ${ranks.grandmaster.title}`,
    image: ranks.grandmaster.imageUrl,
  },
  {
    minLevel: 20,
    title: ranks.elite.title,
    titleWithEmoji: `${ranks.elite.emoji} ${ranks.elite.title}`,
    image: ranks.elite.imageUrl,
  },
  {
    minLevel: 15,
    title: ranks.pro.title,
    titleWithEmoji: `${ranks.pro.emoji} ${ranks.pro.title}`,
    image: ranks.pro.imageUrl,
  },
  {
    minLevel: 10,
    title: ranks.specialist.title,
    titleWithEmoji: `${ranks.specialist.emoji} ${ranks.specialist.title}`,
    image: ranks.specialist.imageUrl,
  },
  {
    minLevel: 5,
    title: ranks.rising.title,
    titleWithEmoji: `${ranks.rising.emoji} ${ranks.rising.title}`,
    image: ranks.rising.imageUrl,
  },
  {
    minLevel: 3,
    title: ranks.enthusiast.title,
    titleWithEmoji: `${ranks.enthusiast.emoji} ${ranks.enthusiast.title}`,
    image: ranks.enthusiast.imageUrl,
  },
  {
    minLevel: 1,
    title: ranks.listener.title,
    titleWithEmoji: `${ranks.listener.emoji} ${ranks.listener.title}`,
    image: ranks.listener.imageUrl,
  },
];

export const getRankTitle = (level: number): string => {
  const rank = RANKS.find((r) => level >= r.minLevel);
  return rank ? rank.title : RANKS[RANKS.length - 1].title;
};

export const getRankTitleWithEmoji = (level: number): string => {
  const rank = RANKS.find((r) => level >= r.minLevel);
  return rank ? rank.titleWithEmoji : RANKS[RANKS.length - 1].titleWithEmoji;
};

export const getRankImage = (level: number): string => {
  const rank = RANKS.find((r) => level >= r.minLevel);
  return rank ? rank.image : RANKS[RANKS.length - 1].image;
};
