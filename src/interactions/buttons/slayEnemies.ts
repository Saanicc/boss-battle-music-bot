import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { execute as slayEnemies } from "../commands/playBossMusic";

export const slayEnemiesButton = new ButtonBuilder()
  .setCustomId("slay_enemies")
  .setLabel("Slay enemies")
  .setStyle(ButtonStyle.Primary);

export const execute = async (interaction: ButtonInteraction) => {
  const { guild } = interaction;
  if (!guild) {
    await interaction.reply("⚠️ No guild was found.");
    return;
  }

  slayEnemies(interaction);
};
