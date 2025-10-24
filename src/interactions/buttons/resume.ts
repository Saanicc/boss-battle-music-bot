import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { useQueue } from "discord-player";
import { emoji } from "../../utils/constants/emojis";

export const resumeButton = new ButtonBuilder()
  .setCustomId("resume")
  .setEmoji(emoji.play)
  .setStyle(ButtonStyle.Success);

export const execute = async (interaction: ButtonInteraction) => {
  await interaction.deferUpdate();
  const { guild } = interaction;
  if (!guild) {
    await interaction.reply("⚠️ No guild was found.");
    return;
  }

  const queue = useQueue();

  if (!queue) return;

  queue.node.resume();
};
