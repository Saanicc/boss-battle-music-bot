import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { player } from "../../index";

export const stopButton = new ButtonBuilder()
  .setCustomId("stop")
  .setLabel("Stop")
  .setStyle(ButtonStyle.Danger);

export const execute = async (interaction: ButtonInteraction) => {
  const { guildId } = interaction;

  if (!guildId) {
    await interaction.reply("⚠️ No guild was found.");
    return;
  }

  const queue = player.nodes.get(guildId);

  if (!queue) {
    await interaction.reply("⚠️ No active music queue.");
    return;
  }

  queue.delete();
  await interaction.reply("🛑 Music stopped and queue cleared.");
};
