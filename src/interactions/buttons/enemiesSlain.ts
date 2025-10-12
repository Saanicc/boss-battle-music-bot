import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { player } from "../..";

export const enemiesSlainButton = new ButtonBuilder()
  .setCustomId("enemies_slain")
  .setLabel("Enemies slain")
  .setStyle(ButtonStyle.Primary);

export const execute = async (interaction: ButtonInteraction) => {
  const { guild } = interaction;
  if (!guild) {
    await interaction.reply("⚠️ No guild was found.");
    return;
  }

  const queue = player.nodes.get(guild);

  if (!queue) {
    return interaction.reply("Could not find an active queue.");
  }

  queue.history.clear();
  queue.tracks.clear();
  queue.clear();
  queue.emit("emptyQueue", queue);
};
