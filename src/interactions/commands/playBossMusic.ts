import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import fs from "fs";
import path from "path";
import { player } from "../../index";
import { QueryType, Track } from "discord-player";

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
          color: 0xffcc00,
        },
      ],
      flags: "Ephemeral",
    });
    return;
  }

  // Grab all audio files
  const musicDir = path.join(process.cwd(), "music");
  const files = fs
    .readdirSync(musicDir)
    .filter(
      (f) => f.endsWith(".mp3") || f.endsWith(".flac") || f.endsWith(".wav")
    );

  if (files.length === 0) {
    await interaction.reply("⚠️ No music files found in `/music` folder!");
    return;
  }

  const filePaths = files.map((f) => path.resolve(musicDir, f));

  try {
    const queue = player.nodes.create(guildMember.guild, {
      metadata: { channel: interaction.channel },
    });

    const tracks: Track[] = [];

    for (const filePath of filePaths) {
      const result = await player.search(filePath, {
        requestedBy: interaction.user,
        searchEngine: QueryType.FILE,
      });
      if (result.hasTracks()) {
        tracks.push(result.tracks[0]);
      }
    }
    const shuffledTracks = shuffleArray(tracks);

    queue.addTrack(shuffledTracks);
    if (!queue.connection) await queue.connect(channel);

    if (!queue.isPlaying()) await queue.node.play();

    await interaction.reply(`🎶 Shuffled and queued ${files.length} tracks!`);
  } catch (err) {
    console.error(err);
    await interaction.reply("❌ Something went wrong while trying to play.");
  }
};
