import { ActivityType, ButtonInteraction } from "discord.js";
import { player } from "../../index";
import { setBotActivity } from "../../utils/helpers/setBotActivity";

export const stopMusic = async (interaction: ButtonInteraction) => {
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
  await setBotActivity(
    interaction.client,
    "Awaiting greatness...",
    ActivityType.Custom
  );
  await interaction.reply("🛑 Music stopped and queue cleared.");
};
