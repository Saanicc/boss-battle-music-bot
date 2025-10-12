import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { player } from "../..";

export const enemiesSlainButton = new ButtonBuilder()
  .setCustomId("enemies_slain")
  .setLabel("Enemies slain")
  .setStyle(ButtonStyle.Primary);

export const execute = async (interaction: ButtonInteraction) => {
  interaction.deferUpdate();
  const { guild } = interaction;
  if (!guild) {
    await interaction.reply("⚠️ No guild was found.");
    return;
  }

  const queue = player.nodes.get(guild);

  if (!queue) return;

  queue.node.pause();
  queue.history.clear();
  queue.tracks.clear();
};
