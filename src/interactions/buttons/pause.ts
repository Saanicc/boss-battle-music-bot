import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { useTimeline } from "discord-player";

export const pauseButton = new ButtonBuilder()
  .setCustomId("pause")
  .setLabel("Pause")
  .setStyle(ButtonStyle.Primary);

export const execute = async (interaction: ButtonInteraction) => {
  const { guild } = interaction;
  if (!guild) {
    await interaction.reply("⚠️ No guild was found.");
    return;
  }

  const timeline = useTimeline({
    node: guild,
  });

  if (!timeline) {
    return interaction.reply(
      "This server does not have an active player session."
    );
  }

  timeline.pause();
  interaction.deferUpdate();
};
