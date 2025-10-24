import { xpEmoji } from "../constants/emojis";

export const getTreasureInfo = (userId: string, gainedXP: number) => {
  if (!gainedXP) return;

  let title: string;
  let message: string;

  switch (true) {
    case gainedXP >= 200:
      title = `${xpEmoji.legendary} *LEGENDARY FIND!*`;
      message = `${userId} unearthed an ancient relic granting 100× XP!`;
      break;
    case gainedXP >= 100:
      title = `${xpEmoji.epic} *Epic Treasure!*`;
      message = `${userId} struck diamonds granting 50× XP!`;
      break;
    case gainedXP >= 50:
      title = `${xpEmoji.rare} *Rare Find!*`;
      message = `${userId} discovered a hidden chest containing 25× XP!`;
      break;
    case gainedXP >= 20:
      title = `${xpEmoji.gold} *Lucky Find*`;
      message = `${userId} found a golden ingot granting 10× XP!`;
      break;
    default:
      title = `${xpEmoji.coins} *Small Treasure*`;
      message = `${userId} found some shiny coins granting 2.5× XP!`;
  }

  return {
    title,
    description: `${message} (+${gainedXP} XP)`,
  };
};
