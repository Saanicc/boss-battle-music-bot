import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { player } from "../..";

export const resumeButton = new ButtonBuilder()
  .setCustomId("resume")
  .setLabel("⏵")
  .setStyle(ButtonStyle.Success);

export const execute = async (interaction: ButtonInteraction) => {
  await interaction.deferUpdate();
  const { guild } = interaction;
  if (!guild) {
    await interaction.reply("⚠️ No guild was found.");
    return;
  }

  const queue = player.nodes.get(guild);

  if (!queue) return;

  queue.node.resume();
};
