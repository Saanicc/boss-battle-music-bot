export const getTreasureMessage = (userId: string, gainedXP: number) => {
  let msg;
  if (!gainedXP) return;

  switch (true) {
    case gainedXP >= 100:
      msg = `🌟 **LEGENDARY FIND!** ${userId} unearthed an ancient relic granting 100x XP!`;
      break;
    case gainedXP >= 50:
      msg = `🏆 **Epic Treasure!** ${userId} struck gold for 50x XP!`;
      break;
    case gainedXP >= 25:
      msg = `💎 **Rare Find!** ${userId}'s adventure yields 25x XP!`;
      break;
    case gainedXP >= 10:
      msg = `✨ ${userId} discovered a hidden chest with 10x XP!`;
      break;
    default:
      msg = `💰 ${userId} found some shiny coins granting 2.5x XP!`;
  }

  return `${msg} (+${gainedXP})`;
};
