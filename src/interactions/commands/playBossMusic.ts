import {
  ButtonInteraction,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { player } from "../../index";
import { getAllMusicFiles } from "../../utils/helpers/getAllMusicFiles";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import { queueManager } from "../../utils/queueManager";
import { getRandomFightGif } from "../../utils/helpers/getRandomFightingGif";

export const data = new SlashCommandBuilder()
  .setName("play_boss_music")
  .setDescription("Start playing EPIC boss battle music!");

export const execute = async (
  interaction: CommandInteraction | ButtonInteraction
) => {
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

  const guild = guildMember.guild;

  let queue = player.nodes.get(guild);

  if (queue && queue.tracks.size > 0) {
    queueManager.store(
      guild.id,
      [...queue.tracks.data],
      queue.currentTrack ?? undefined
    );

    queue.history.clear();
    queue.tracks.clear();
    queue.clear();
  } else {
    queue = player.nodes.create(guild, {
      metadata: { channel: interaction.channel, voiceChannel: channel },
    });
  }

  try {
    const tracks = await getAllMusicFiles("music", player, interaction.user);
    const hornTracks = await getAllMusicFiles(
      "music/horns",
      player,
      interaction.user
    );
    const pickRandomHornTrack = () => {
      const number = Math.floor(Math.random() * hornTracks.length);
      return hornTracks[number];
    };

    queue.addTrack(tracks);
    queue.tracks.shuffle();
    queue.insertTrack(pickRandomHornTrack());

    if (!queue.connection) await queue.connect(channel);
    await queue.node.play();

    queueManager.setQueueType("boss");

    const data = buildEmbedMessage({
      title: "⚔️ Time to slay some enemies!",
      imageUrl: await getRandomFightGif(),
      color: "green",
    });
    if (!interaction.channel) return;

    await interaction.reply(data);
  } catch (err) {
    console.error(err);
    await interaction.reply("❌ Something went wrong while trying to play.");
  }
};
