import { Track } from "discord-player";
import {
  ActionRowBuilder,
  APIEmbed,
  ButtonBuilder,
  MessageCreateOptions,
} from "discord.js";
import { pauseButton } from "../../interactions/buttons/pause";
import { stopButton } from "../../interactions/buttons/stop";
import { resumeButton } from "../../interactions/buttons/resume";
import { EMBED_COLORS } from "../constants/constants";

export const buildNowPlayingMessage = (
  track: Track,
  isPlaying: boolean
): MessageCreateOptions => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    isPlaying ? pauseButton : resumeButton,
    stopButton
  );

  const embed = {
    title: isPlaying ? "Now Playing 🎶" : "Music paused",
    description: `**${track.title}**`,
    fields: [
      {
        name: "Requested by",
        value: track.requestedBy?.toString() ?? "Unknown",
        inline: true,
      },
      { name: "Duration", value: track.duration, inline: true },
    ],
    color: EMBED_COLORS.green,
  } as APIEmbed;

  return {
    embeds: [embed],
    components: [row],
  };
};
