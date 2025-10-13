import {
  ButtonInteraction,
  CommandInteraction,
  MessageCreateOptions,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { player } from "../../index";
import { getAllMusicFiles } from "../../utils/helpers/getAllMusicFiles";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import { getRandomFightGif } from "../../utils/helpers/getRandomFightingGif";
import { queueManager } from "../../services/queueManager";

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
  let newQueue = player.nodes.create(guild, {
    metadata: {
      channel: interaction.channel,
      voiceChannel: channel,
    },
  });

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

    newQueue.addTrack(tracks);
    newQueue.tracks.shuffle();
    newQueue.insertTrack(pickRandomHornTrack());

    if (!newQueue.connection) await newQueue.connect(channel);
    await newQueue.node.play();

    const data = buildEmbedMessage({
      title: "⚔️ Time to slay some enemies!",
      imageUrl: await getRandomFightGif(),
      color: "green",
    });
    if (!interaction.channel) return;

    queueManager.setQueueType("boss");

    await (interaction.channel as TextChannel).send(
      data as MessageCreateOptions
    );
  } catch (err) {
    console.error(err);
    await interaction.reply("❌ Something went wrong while trying to play.");
  }
};
