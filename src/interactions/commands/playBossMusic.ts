import {
  ButtonInteraction,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { getAllMusicFiles } from "../../utils/helpers/getAllMusicFiles";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import { getRandomFightGif } from "../../utils/helpers/getRandomFightingGif";
import { queueManager } from "../../services/queueManager";
import { savePreviousQueue } from "../../utils/helpers/saveQueueData";
import { getBossTracks } from "../../utils/helpers/getBossTracks";
import { useMainPlayer, useQueue } from "discord-player";
import { delay } from "../../utils/helpers/utils";

export const data = new SlashCommandBuilder()
  .setName("play_boss_music")
  .setDescription("Start playing EPIC boss battle music!");

export const execute = async (
  interaction: CommandInteraction | ButtonInteraction
) => {
  const player = useMainPlayer();
  const queue = useQueue();
  const guildMember = await interaction.guild?.members.fetch(
    interaction.user.id
  );
  const channel = guildMember?.voice.channel;

  if (!channel) {
    const data = buildEmbedMessage({
      title: "❌ You must be in a voice channel.",
      color: "error",
      ephemeral: true,
    });
    await interaction.reply(data);
    return;
  }

  const guild = guildMember.guild;

  if (queue) {
    queue.node.stop();
    await savePreviousQueue(queue, guild.id);
    (queue.metadata as any).isSwithing = true;
    queue.delete();
  }

  const newQueue = player.nodes.create(guild, {
    metadata: {
      channel: interaction.channel,
      voiceChannel: channel,
    },
    leaveOnEnd: true,
    leaveOnEndCooldown: 60000,
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 15000,
  });

  try {
    const tracks = await getBossTracks(
      "music/boss_music.json",
      player,
      interaction.user
    );
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

    queueManager.setQueueType("boss");

    const data = buildEmbedMessage({
      title: "⚔️ Time to slay some enemies!",
      titleFontSize: "lg",
      imageUrl: await getRandomFightGif(),
      color: "bossMode",
    });

    await interaction.reply(data);

    await delay(500);

    if (!newQueue.connection) await newQueue.connect(channel);
    if (!newQueue.isPlaying()) await newQueue.node.play();
  } catch (err) {
    console.error(err);
    await interaction.reply("❌ Something went wrong while trying to play.");
  }
};
