import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import { player } from "../../index";
import { Track } from "discord-player";
import { getAllMusicFiles } from "../../utils/helpers/getAllMusicFiles";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";

const shuffleArray = (arr: Track[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const data = new SlashCommandBuilder()
  .setName("play_boss_music")
  .setDescription("Start playing EPIC boss battle music!");

export const execute = async (interaction: CommandInteraction) => {
  const guildMember = await interaction.guild?.members.fetch(
    interaction.user.id
  );
  const channel = guildMember?.voice.channel;

  if (!channel) {
    const data = buildEmbedMessage({
      title: "❌ You must be in a voice channel.",
      color: "red",
      ephemeral: true,
    });
    await interaction.reply(data);
    return;
  }

  const playerNode = player.nodes.get(guildMember.guild);
  if (playerNode) {
    const data = buildEmbedMessage({
      title: "Queue already exists!",
      color: "orange",
      description:
        "A player queue already exists. If music is paused, please use the resume button instead.",
      ephemeral: true,
    });
    interaction.reply(data);
    return;
  }

  try {
    const tracks = await getAllMusicFiles("music", player, interaction.user);

    const queue = player.nodes.create(guildMember.guild, {
      metadata: { channel: interaction.channel },
    });

    queue.addTrack(shuffleArray(tracks));

    const hornTracks = await getAllMusicFiles(
      "music/horns",
      player,
      interaction.user
    );

    const pickRandomHornTrack = () => {
      const number = Math.floor(Math.min(Math.random() * hornTracks.length));
      return hornTracks[number];
    };

    queue.insertTrack(pickRandomHornTrack());

    if (!queue.connection) await queue.connect(channel);

    if (!queue.isPlaying()) await queue.node.play();

    const data = buildEmbedMessage({
      title: `🎶 Shuffled and queued ${queue.tracks.size} tracks!`,
    });
    await interaction.reply(data);
  } catch (err) {
    console.error(err);
    await interaction.reply("❌ Something went wrong while trying to play.");
  }
};
