import { User, UserType } from "../models/User";

export type XPGrantingCommand = "play_boss_music" | "play";

const XP_BASE = 2;

export const getRequiredXP = (level: number) => {
  const formula = 10 + (level * 12) ** 1.2;
  return Math.floor(formula);
};

const levelUpUser = (user: UserType, gainedXP: number) => {
  user.xp += gainedXP;

  let leveledUp = false;
  let levelsGained = 0;

  let xpRequired = getRequiredXP(user.level);
  while (user.xp >= xpRequired) {
    user.xp -= xpRequired;
    user.level++;
    leveledUp = true;
    levelsGained++;
    xpRequired = getRequiredXP(user.level);
  }

  return {
    leveledUp,
    levelsGained,
  };
};

export const addXP = async (
  guildId: string,
  userId: string,
  commandName: XPGrantingCommand
) => {
  const now = new Date();
  let user = await User.findOne({ guildId, userId });

  if (!user) {
    user = await User.create({ guildId, userId });
  }

  if (user.lastXP && now.getTime() - user.lastXP.getTime() < 5000) {
    return { ...user.toObject(), noXP: true };
  }

  const previousLevel = user.level;
  let gainedXP = XP_BASE;
  let treasure = false;
  let roll = Math.random();

  if (roll < 0.0000001) {
    gainedXP *= 100;
    treasure = true;
  } else if (roll < 0.000001) {
    gainedXP *= 50;
    treasure = true;
  } else if (roll < 0.00001) {
    gainedXP *= 25;
    treasure = true;
  } else if (roll < 0.0001) {
    gainedXP *= 10;
    treasure = true;
  } else if (roll < 0.001) {
    gainedXP *= 2.5;
    treasure = true;
  }

  user.lastXP = now;
  if (commandName === "play_boss_music") user.totalBossPlays++;
  else user.totalPlays++;

  const { leveledUp, levelsGained } = levelUpUser(user, gainedXP);

  await user.save();

  return {
    user,
    gainedXP,
    leveledUp,
    levelsGained,
    treasure,
    previousLevel,
    noXP: false,
  };
};

export const getXPToNextRank = (level: number, xp: number) =>
  getRequiredXP(level) - xp;
