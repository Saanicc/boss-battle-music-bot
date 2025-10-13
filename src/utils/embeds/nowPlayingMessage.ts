import { GuildQueue, Track } from "discord-player";
import {
  ActionRowBuilder,
  APIEmbed,
  ButtonBuilder,
  MessageCreateOptions,
} from "discord.js";
import { enemiesSlainButton } from "../../interactions/buttons/enemiesSlain";
import { slayEnemiesButton } from "../../interactions/buttons/slayEnemies";
import { stopButton } from "../../interactions/buttons/stop";
import { EMBED_COLORS } from "../constants/constants";
import { queueManager } from "../../services/queueManager";
import { pauseButton } from "../../interactions/buttons/pause";
import { resumeButton } from "../../interactions/buttons/resume";

const createProgressBar = (queue: GuildQueue, size = 20): string => {
  const progress = queue.node.getTimestamp();

  if (!progress) return "N/A";

  if (!progress.current.value || !progress.total.value) return "N/A";

  const ratio = progress.current.value / progress.total.value;
  const filled = Math.round(ratio * size);
  const empty = Math.max(size - filled, 0);

  return `▰`.repeat(filled) + `▱`.repeat(empty);
};

export const buildNowPlayingMessage = (
  track: Track,
  isPlaying: boolean,
  queue?: GuildQueue
): MessageCreateOptions => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    isPlaying ? pauseButton : resumeButton,
    (isPlaying || !isPlaying) && queueManager.getQueueType() === "boss"
      ? enemiesSlainButton
      : slayEnemiesButton,
    stopButton
  );

  const progressBar = queue ? createProgressBar(queue) : "N/A";
  const timestamp = queue?.node.getTimestamp();
  const currentTime = timestamp?.current?.label ?? "0:00";
  const totalTime = timestamp?.total?.label ?? track.duration;

  const embed = {
    title: isPlaying ? "🎶 Now Playing" : "🛑 Music Stopped",
    description: `**${track.title}**`,
    fields: [
      {
        name: "Requested by",
        value: track.requestedBy?.toString() ?? "Unknown",
        inline: true,
      },
      {
        name: "Duration",
        value: track.duration,
        inline: true,
      },
      ...(queue
        ? [
            {
              name: "Progress",
              value: `${progressBar}\n${currentTime} / ${totalTime}`,
            },
            {
              name: "Track",
              value: `**${queue.history.tracks.size + 1}** of **${
                queue.tracks.size + queue.history.tracks.size + 1
              }**`,
              inline: true,
            },
          ]
        : []),
    ],
    color: isPlaying ? EMBED_COLORS.green : EMBED_COLORS.red,
  } as APIEmbed;

  return {
    embeds: [embed],
    components: [row],
  };
};
