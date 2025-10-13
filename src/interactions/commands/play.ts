import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import { player } from "../..";

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
  let normalQueue = player.nodes.get(guild.id);

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

    if (!normalQueue.connection) await normalQueue.connect(channel);
    if (!normalQueue.isPlaying()) await normalQueue.node.play();

    const data = buildEmbedMessage({
      title: `Queued at position #${normalQueue.tracks.size + 1}`,
      description: `[${track.title}](${track.url}) by ${track.author} [${track.duration}]`,
      thumbnail: result.tracks[0].thumbnail,
      footerText: "Not the correct track? Try being more specific",
      color: "green",
    });
    interaction.reply(data);
  } catch (error) {
    console.error(error);
  }
};
