import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import path from "path";
import fs from "fs";
import { getFormattedTrackDescription } from "../../utils/helpers/getFormattedTrackDescription";
import { useMainPlayer, useQueue } from "discord-player";
import { getThumbnail } from "../../utils/helpers/utils";

type FileData = {
  bossTracks: string[];
};

export const data = new SlashCommandBuilder()
  .setName("add_track")
  .setDescription("Add a new track to the boss music library")
  .addStringOption((option) =>
    option
      .setName("url")
      .setDescription("Enter url of track to add")
      .setRequired(true)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const url = interaction.options.getString("url", true);

  if (!url.match(/https:\/\/.*.*/)) {
    const data = buildEmbedMessage({
      title: "Not a valid url",
      description: "Please enter a valid url",
      ephemeral: true,
      color: "error",
    });
    return interaction.reply(data);
  }

  const fullPath = path.join(process.cwd(), "/music/boss_music.json");
  const fileData = JSON.parse(fs.readFileSync(fullPath, "utf-8")) as FileData;

  if (Array.isArray(fileData.bossTracks)) {
    if (fileData.bossTracks.find((trackUrl) => trackUrl === url)) {
      const message = buildEmbedMessage({
        title: "The track (URL) already exist!",
        ephemeral: true,
        color: "error",
      });
      return interaction.reply(message);
    }

    fileData.bossTracks.push(url);
    fs.writeFileSync(fullPath, JSON.stringify(fileData));
  }

  const player = useMainPlayer();
  const queue = useQueue();

  const result = await player.search(url, {
    requestedBy: interaction.user,
  });

  if (result.tracks.length === 0) {
    const data = buildEmbedMessage({
      title: "No track found",
      description:
        "No track with that URL was found, please make sure the URL is valid.",
      color: "error",
      ephemeral: true,
    });

    return interaction.reply(data);
  }

  const data = buildEmbedMessage({
    title: `Added successfully`,
    description: `${interaction.user.toString()} added ${getFormattedTrackDescription(
      result.tracks[0],
      queue
    )} to the boss music library!`,
    thumbnail: getThumbnail(result.tracks[0]),
    color: "success",
  });

  return interaction.reply(data);
};
