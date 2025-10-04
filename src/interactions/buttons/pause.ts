import { ButtonInteraction } from "discord.js";
import { player } from "../../index";
import { useTimeline } from "discord-player";

export const pauseMusic = async (interaction: ButtonInteraction) => {
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
