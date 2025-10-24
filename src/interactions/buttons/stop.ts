import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { queueManager } from "../../services/queueManager";
import { useQueue } from "discord-player";

export const stopButton = new ButtonBuilder()
  .setCustomId("stop")
  .setLabel("⏹")
  .setStyle(ButtonStyle.Danger);

export const execute = async (interaction: ButtonInteraction) => {
  const queue = useQueue();

  const { guildId } = interaction;

  if (!guildId) {
    await interaction.reply("⚠️ No guild was found.");
    return;
  }

  if (!queue) {
    await interaction.reply("⚠️ No active music queue.");
    return;
  }

  queue.delete();
  queueManager.clear(guildId);
};
