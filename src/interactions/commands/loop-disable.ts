import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import { QueueRepeatMode, useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
  .setName("loop_disable")
  .setDescription("Disables the loop mode for this playback");

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

  queue.setRepeatMode(QueueRepeatMode.OFF);

  const embedMessage = buildEmbedMessage({
    title: "Looping has been disabled",
    color: "info",
  });

  await interaction.editReply(embedMessage);
}
