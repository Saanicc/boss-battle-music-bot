import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import { useMainPlayer, useQueue } from "discord-player";
import { getFormattedTrackDescription } from "../../utils/helpers/getFormattedTrackDescription";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Plays a track from a url or search query")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("The url or query to search for")
      .setRequired(true)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const player = useMainPlayer();
  const queue = useQueue();

  const query = interaction.options.getString("query", true);
  const member = await interaction.guild?.members.fetch(interaction.user.id);
  const channel = member?.voice.channel;

  if (!channel) {
    const data = buildEmbedMessage({
      title: "❌ You must be in a voice channel.",
      ephemeral: true,
    });
    return interaction.reply(data);
  }

  const guild = member.guild;
  let normalQueue = queue;

  if (!normalQueue) {
    normalQueue = player.nodes.create(guild, {
      metadata: { channel: interaction.channel, voiceChannel: channel },
    });
  }
  try {
    const result = await player.search(query, {
      requestedBy: interaction.user,
    });

    if (!result.tracks.length) {
      const data = buildEmbedMessage({
        title: "❌ No results found.",
      });
      return interaction.reply(data);
    }

    const track = result.tracks[0];
    normalQueue.addTrack(track);

    const data = buildEmbedMessage({
      title: `Queued at position #${normalQueue.tracks.size}`,
      description: `${getFormattedTrackDescription(track)}`,
      thumbnail: result.tracks[0].thumbnail,
      footerText: "Not the correct track? Try being more specific",
      color: "queue",
    });
    interaction.reply(data);

    if (!normalQueue.connection) await normalQueue.connect(channel);
    if (!normalQueue.isPlaying()) await normalQueue.node.play();
  } catch (error) {
    console.error(error);
  }
};
