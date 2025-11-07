import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import { QueueRepeatMode, useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
  .setName("loop_current")
  .setDescription("loops the current track");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const queue = useQueue();

  if (!queue) {
    const data = buildEmbedMessage({
      title: "This server does not have an active player session.",
      ephemeral: true,
      color: "info",
    });
    return interaction.editReply(data);
  }

  queue.setRepeatMode(QueueRepeatMode.TRACK);

  const embedMessage = buildEmbedMessage({
    title: "Now looping the current track",
    color: "info",
  });

  await interaction.editReply(embedMessage);
}
