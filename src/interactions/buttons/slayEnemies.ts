import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { execute as slayEnemies } from "../commands/playBossMusic";
import { queueManager } from "../../services/queueManager";
import { player } from "../..";
import { delay } from "../../utils/helpers/utils";

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

  const saveAndReturnQueue = () => {
    const queue = player.nodes.get(guild);

    if (!queue) {
      console.log("Can't save a queue that doesn't exit.");
      return;
    }

    const progress = queue.node.getTimestamp()?.current.value ?? 0;

    const voiceChannel = (queue.metadata as any).voiceChannel;

    const allTracks = [...queue.tracks.data];

    const filteredTracks = allTracks.filter(
      (t) => t.url !== queue.currentTrack?.url
    );

    queueManager.store(
      guild.id,
      filteredTracks,
      "normal",
      queue.currentTrack ?? undefined,
      progress,
      voiceChannel
    );

    return queue;
  };

  const queue = saveAndReturnQueue();

  if (queue) {
    queue.node.pause();
    queue.history.clear();
    queue.tracks.clear();
    (queue.metadata as any).isSwithing = true;
    await delay(500);
    queue.delete();
  }

  await delay(1000);

  slayEnemies(interaction);
};
