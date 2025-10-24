import {
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
} from "discord.js";
import { useQueue } from "discord-player";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import { emoji } from "../../utils/constants/emojis";

export const nextButton = new ButtonBuilder()
  .setCustomId("next")
  .setEmoji(emoji.next)
  .setStyle(ButtonStyle.Primary);

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

  queue.history.next();
  if (queue.node.isPaused()) queue.node.resume();
}
