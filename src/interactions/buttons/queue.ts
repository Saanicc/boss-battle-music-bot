import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { execute as showQueue } from "../commands/queue";

export const queueButton = new ButtonBuilder()
  .setCustomId("queue")
  .setLabel("🧾")
  .setStyle(ButtonStyle.Secondary);

export const execute = async (interaction: ButtonInteraction) => {
  const { guild } = interaction;
  if (!guild) {
    await interaction.reply("⚠️ No guild was found.");
    return;
  }

  showQueue(interaction);
};
