import { User } from "../../models/User";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getRequiredXP, getXPToNextRank } from "../../modules/xpSystem";
import { getRankImage, getRankTitle } from "../../modules/rankSystem";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";

export const data = new SlashCommandBuilder()
  .setName("rank")
  .setDescription("Check your current DJ rank")
  .addUserOption((option) =>
    option
      .setName("target")
      .setDescription("Check another user's rank")
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId;
  if (!guildId) return;

  const targetUser = interaction.options.getUser("target") || interaction.user;

  if (!targetUser) return;

  let user = await User.findOne({
    guildId: guildId,
    userId: targetUser.id,
  });
  if (!user) {
    user = await User.create({
      guildId: guildId,
      userId: targetUser.id,
    });
    await user.save();
  }

  const rankTitle = getRankTitle(user.level);
  const xpToNext = getXPToNextRank(user.level, user.xp) ?? 0;

  const tracksQueued = user.totalPlays;
  const timesQueuedBossTracks = user.totalBossPlays;

  const createXPBar = (currentXP: number, xpNeeded: number, length = 20) => {
    const filledLength = Math.round((currentXP / xpNeeded) * length);
    const bar = "▓".repeat(filledLength) + "░".repeat(length - filledLength);
    return bar;
  };

  const xpBar = createXPBar(user.xp, getRequiredXP(user.level + 1));

  const message = buildEmbedMessage({
    title: `${targetUser.toString()}'s Rank`,
    titleFontSize: "md",
    thumbnail: getRankImage(user.level),
    description: `
**Level: ** ${user.level}
**Rank:** ${rankTitle}

**XP to Next Rank**
${xpToNext} XP

**Progress**
${xpBar}

**Tracks queued:** ${tracksQueued}
**Boss music plays:** ${timesQueuedBossTracks}
    `,
    color: "info",
    footerText: "Keep playing music to level up!",
  });

  return interaction.reply(message);
}
