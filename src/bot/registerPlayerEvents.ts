import { GuildQueueEvent, Player } from "discord-player";
import {
  MessageCreateOptions,
  MessageEditOptions,
  TextChannel,
} from "discord.js";
import { buildNowPlayingMessage } from "../utils/embeds/nowPlayingMessage";
import { musicPlayerMessage } from "../services/musicPlayerMessage";
import { buildEmbedMessage } from "../utils/embeds/embedMessage";
import { delay } from "../utils/helpers/utils";

export const registerPlayerEvents = (player: Player) => {
  player.events.on(GuildQueueEvent.PlayerStart, async (queue, track) => {
    const channel = queue.metadata.channel as TextChannel;

    musicPlayerMessage.clearProgressInterval();

    await musicPlayerMessage.delete();

    await delay(1000);

    const data = buildNowPlayingMessage(track, true, queue);
    const msg = await channel.send(data as MessageCreateOptions);
    musicPlayerMessage.set(msg);

    musicPlayerMessage.setProgressInterval(
      setInterval(async () => {
        if (!queue.node.isPlaying()) return;

        const updateData = buildNowPlayingMessage(track, true, queue);
        try {
          await musicPlayerMessage.edit(updateData as MessageEditOptions);
        } catch (err) {
          console.error("Failed to update progress:", err);
        }
      }, 1000)
    );
  });

  player.events.on(GuildQueueEvent.PlayerPause, async (queue) => {
    if (!queue.currentTrack) return;

    const data = buildNowPlayingMessage(queue.currentTrack, false, queue);

    await musicPlayerMessage.edit(data as MessageEditOptions);
  });

  player.events.on(GuildQueueEvent.QueueDelete, async (queue) => {
    if (queue.metadata.isSwithing) return;

    await musicPlayerMessage.delete();
    musicPlayerMessage.set(undefined);

    const data = buildEmbedMessage({
      title: "Left the voice channel",
      color: "default",
    });

    const channel = queue.metadata.channel;
    await channel.send(data as MessageCreateOptions);
  });

  player.events.on(GuildQueueEvent.EmptyQueue, async (queue) => {
    const channel = queue.metadata.channel as TextChannel;

    const data = buildEmbedMessage({
      title:
        "Reached the end of the queue. Please queue new track(s) to continue playback.",
      color: "info",
    });

    await channel.send(data as MessageCreateOptions);
  });

  player.events.on(GuildQueueEvent.PlayerError, async (queue, error, track) => {
    const channel = queue.metadata.channel as TextChannel;

    const extractorName = track.extractor?.identifier ?? "Unknown";
    const streamUrl =
      track.raw?.source?.url || track.raw?.url || track.url || "N/A";

    const data = buildEmbedMessage({
      title: `⚠️ ${error.name} ⚠️`,
      description: `
        **Message:** ${error.message}

        🎵 **Track:** ${track.title}
        🔗 **URL:** [Open Track](${track.url})
        🧩 **Extractor:** ${extractorName}
        📡 **Stream:** ${streamUrl}
      `,
      color: "error",
    });

    await channel.send(data as MessageCreateOptions);
  });

  player.events.on(GuildQueueEvent.Error, async (queue, error) => {
    const channel = queue.metadata.channel as TextChannel;

    const embed = buildEmbedMessage({
      title: `⚠️ ${error.name} ⚠️`,
      description: error.message,
      color: "error",
    });

    await channel.send(embed as MessageCreateOptions);
  });
};
