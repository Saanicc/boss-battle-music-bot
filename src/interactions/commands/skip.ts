import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { useQueue } from "discord-player";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";

export const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skip the currently playing song");

export async function execute(interaction: ChatInputCommandInteraction) {
  const queue = useQueue();

  if (!queue) {
    const data = buildEmbedMessage({
      title: "This server does not have an active player session.",
      ephemeral: true,
      color: "info",
    });
    return interaction.reply(data);
  }

  if (!queue.isPlaying()) {
    const data = buildEmbedMessage({
      title: "There is no track playing.",
      ephemeral: true,
      color: "info",
    });
    await interaction.reply(data);
    return;
  }

  queue.node.skip();
  if (queue.node.isPaused()) queue.node.resume();

  const data = buildEmbedMessage({
    title: "Skipped to the next track in queue.",
    color: "info",
  });
  return interaction.reply(data);
}
