import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import path from "path";
import fs from "fs";

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

  const data = buildEmbedMessage({
    title: "Added successfully",
    description: `${interaction.user.toString()} added a track to the boss music library!`,
    color: "success",
  });
  await interaction.reply(data);
};
