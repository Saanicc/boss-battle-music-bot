import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import { player } from "../../index";
import { Track } from "discord-player";
import { EMBED_COLORS } from "../../utils/constants";
import { getAllMusicFiles } from "../../utils/helpers/getAllMusicFiles";

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
    await interaction.reply("❌ You must be in a voice channel.");
    return;
  }

  const playerNode = player.nodes.get(guildMember.guild);
  if (playerNode) {
    interaction.reply({
      embeds: [
        {
          title: "Queue already exists!",
          description:
            "A player queue already exists. If music is paused, please use the resume button instead.",
          color: EMBED_COLORS.orange,
        },
      ],
      flags: "Ephemeral",
    });
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
    queue.insertTrack(hornTracks[2]);

    if (!queue.connection) await queue.connect(channel);

    if (!queue.isPlaying()) await queue.node.play();

    await interaction.reply(
      `🎶 Shuffled and queued ${queue.tracks.size} tracks!`
    );
  } catch (err) {
    console.error(err);
    await interaction.reply("❌ Something went wrong while trying to play.");
  }
};
