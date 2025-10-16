import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { useQueue } from "discord-player";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import { getFormattedTrackDescription } from "../../utils/helpers/getFormattedTrackDescription";

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
    ${getFormattedTrackDescription(currentTrack)}
    
    **Upcoming Tracks:**
    ${upcomingTracks
      .map(
        (track, index) => `${index + 1}. ${getFormattedTrackDescription(track)}`
      )
      .join("\n")}
    `,
    color: "queue",
    ephemeral: true,
  });

  return interaction.reply(data);
}
