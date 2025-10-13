import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { player } from "../..";
import { queueManager } from "../../services/queueManager";
import { restoreOldQueue } from "../../utils/helpers/restoreOldQueue";
import { delay } from "../../utils/helpers/utils";

export const enemiesSlainButton = new ButtonBuilder()
  .setCustomId("enemies_slain")
  .setLabel("Enemies slain")
  .setStyle(ButtonStyle.Primary);

export const execute = async (interaction: ButtonInteraction) => {
  await interaction.deferUpdate();
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
  (queue.metadata as any).isSwithing = true;
  await delay(500);
  queue.delete();

  const stored = queueManager.retrieve(guild.id);

  if (!stored) return;

  await delay(1000);

  await restoreOldQueue({
    guild,
    textChannel: interaction.channel ?? undefined,
    voiceChannel: stored.voiceChannel,
  });
};
