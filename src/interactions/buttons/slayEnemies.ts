import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { execute as slayEnemies } from "../commands/playBossMusic";
import { emoji } from "../../utils/constants/emojis";

export const slayEnemiesButton = new ButtonBuilder()
  .setCustomId("slay_enemies")
  .setEmoji(emoji.fight)
  .setStyle(ButtonStyle.Secondary);

export const execute = async (interaction: ButtonInteraction) => {
  const { guild } = interaction;
  if (!guild) {
    await interaction.reply("⚠️ No guild was found.");
    return;
  }

  slayEnemies(interaction);
};
