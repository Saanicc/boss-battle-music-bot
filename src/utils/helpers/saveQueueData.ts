import { Guild } from "discord.js";
import { player } from "../..";
import { queueManager } from "../../services/queueManager";
import { delay } from "./utils";

export const savePreviousQueueDataAndDeleteQueue = async (guild: Guild) => {
  const queue = player.nodes.get(guild);

  if (!queue) return;

  const progress = queue.node.getTimestamp()?.current.value ?? 0;

  const voiceChannel = (queue.metadata as any).voiceChannel;

  queueManager.store(
    guild.id,
    [...queue.tracks.data],
    "normal",
    queue.currentTrack ?? undefined,
    progress,
    voiceChannel
  );

  queue.node.pause();
  (queue.metadata as any).isSwithing = true;
  await delay(500);
  queue.delete();
  await delay(1000);
};
