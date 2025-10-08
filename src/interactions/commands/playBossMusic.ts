import {
  ButtonInteraction,
  CommandInteraction,
  InteractionType,
  SlashCommandBuilder,
} from "discord.js";
import { player, resetNowPlaying } from "../../index";
import { getAllMusicFiles } from "../../utils/helpers/getAllMusicFiles";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";

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

  if (interaction.type === InteractionType.ApplicationCommand) {
    if (player.nodes.get(guild)) {
      const data = buildEmbedMessage({
        title: "A queue already exists!",
        color: "orange",
        description:
          "A queue already exists. Please use one of the buttons in the previous reply instead.",
        ephemeral: true,
      });
      interaction.reply(data);
      return;
    }
  }

  await resetNowPlaying();

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

    let queue = player.nodes.get(guild);
    const isNewQueue = !queue;

    if (queue) {
      queue.node.pause();
      queue.tracks.clear();
      queue.addTrack(tracks);
      queue.tracks.shuffle();
      queue.insertTrack(pickRandomHornTrack());
    } else {
      queue = player.nodes.create(guild, {
        metadata: { channel: interaction.channel },
      });
      queue.addTrack(tracks);
      queue.tracks.shuffle();
      queue.insertTrack(pickRandomHornTrack());
    }

    if (!queue.connection) await queue.connect(channel);
    await queue.node.play();

    if (isNewQueue) {
      const data = buildEmbedMessage({
        title: "⚔️ Have fun slaying enemies!",
        description: `Loaded and shuffled ${queue.tracks.size} tracks!`,
        color: "green",
      });
      await interaction.reply(data);
    }
  } catch (err) {
    console.error(err);
    await interaction.reply("❌ Something went wrong while trying to play.");
  }
};
