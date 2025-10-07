import { ActivityType } from "discord.js";

export const BOT_STATUS = {
  playing: { name: "EPIC boss music", type: ActivityType.Listening },
  paused: { name: "Music paused", type: ActivityType.Custom },
  idle: { name: "/play_boss_music", type: ActivityType.Listening },
};

export const EMBED_COLORS = {
  red: 0xff0000,
  green: 0x1db954,
  orange: 0xffcc00,
};
