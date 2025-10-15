import { GuildQueueEvent, Player } from "discord-player";
import {
  MessageCreateOptions,
  MessageEditOptions,
  TextChannel,
} from "discord.js";
import { buildNowPlayingMessage } from "../utils/embeds/nowPlayingMessage";
import { musicPlayerMessage } from "../services/musicPlayerMessage";
import { buildEmbedMessage } from "../utils/embeds/embedMessage";

export const registerPlayerEvents = (player: Player) => {
  player.events.on(GuildQueueEvent.PlayerStart, async (queue, track) => {
    const channel = queue.metadata.channel as TextChannel;

    const data = buildNowPlayingMessage(track, true, queue);

    musicPlayerMessage.clearProgressInterval();

    await musicPlayerMessage.delete();

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
};
