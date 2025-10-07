import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import path from "path";
import fs from "fs";

export const data = new SlashCommandBuilder()
  .setName("add_song")
  .setDescription("Add a new song to the bot")
  .addStringOption((option) =>
    option
      .setName("type")
      .setDescription("Select the type of audio")
      .setRequired(true)
      .addChoices(
        { name: "Song", value: "song" },
        { name: "Horn Sound", value: "horn" }
      )
  )
  .addAttachmentOption((opt) =>
    opt.setName("file").setDescription("Upload your song").setRequired(true)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const file = interaction.options.getAttachment("file", true);
  const type = interaction.options.getString("type", true);

  if (!file) {
    const data = buildEmbedMessage({
      title: "File upload",
      description: "An error occured when processing the file.",
      ephemeral: true,
      color: "red",
    });
    return interaction.reply(data);
  }

  if (!file.contentType?.startsWith("audio/")) {
    const data = buildEmbedMessage({
      title: "File upload",
      description: "Please upload an audio file!",
      ephemeral: true,
      color: "red",
    });
    return interaction.reply(data);
  }

  let filePath = "music";
  if (type === "horn") {
    filePath = "music/horns";
  }

  const res = await fetch(file.url);
  const buffer = Buffer.from(await res.arrayBuffer());
  const savePath = path.join(`${process.cwd()}/${filePath}`, file.name);
  fs.writeFileSync(savePath, buffer);

  const data = buildEmbedMessage({
    title: "File upload",
    description: `Successfully added **${file.name}** to the ${
      type === "horn" ? "horn sound" : "music"
    } library!`,
    ephemeral: true,
    color: "green",
  });
  await interaction.reply(data);
};
