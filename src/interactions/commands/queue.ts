import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { useQueue } from "discord-player";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import { getFormattedTrackTitle } from "../../utils/helpers/getFormattedTrackTitle";

export const data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Display the current queue");

export async function execute(
  interaction: ChatInputCommandInteraction | ButtonInteraction
) {
  const queue = useQueue();

  if (!queue) {
    const data = buildEmbedMessage({
      title: "This server does not have an active player session.",
      ephemeral: true,
      color: "info",
    });
    return interaction.reply(data);
  }

  const currentTrack = queue.currentTrack;
  const upcomingTracks = queue.tracks.data.slice(0, 5);

  const data = buildEmbedMessage({
    title: "⏵ Now Playing",
    description: `
    ${getFormattedTrackTitle(currentTrack)} by ${currentTrack?.author}
    
    **Upcoming Tracks:**
    ${upcomingTracks
      .map(
        (track, index) =>
          `${index + 1}. ${getFormattedTrackTitle(track)} - ${track.author}`
      )
      .join("\n")}
    `,
    color: "queue",
    ephemeral: true,
  });

  return interaction.reply(data);
}
