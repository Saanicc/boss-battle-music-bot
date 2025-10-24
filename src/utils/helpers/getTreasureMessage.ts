import { xpEmoji } from "../constants/emojis";

export const getTreasureMessage = (userId: string, gainedXP: number) => {
  if (!gainedXP) return;

  let message: string;

  switch (true) {
    case gainedXP >= 100:
      message = `${xpEmoji.legendary} **LEGENDARY FIND!** ${userId} unearthed an ancient relic granting 100× XP!`;
      break;
    case gainedXP >= 50:
      message = `${xpEmoji.epic} **Epic Treasure!** ${userId} struck diamonds granting 50× XP!`;
      break;
    case gainedXP >= 25:
      message = `${xpEmoji.rare} **Rare Find!** ${userId} discovered a hidden chest containing 25× XP!`;
      break;
    case gainedXP >= 10:
      message = `${xpEmoji.gold} ${userId} found a golden ingot granting 10× XP!`;
      break;
    default:
      message = `${xpEmoji.coins} ${userId} found some shiny coins granting 2.5× XP!`;
  }

  return `${message} (+${gainedXP} XP)`;
};
