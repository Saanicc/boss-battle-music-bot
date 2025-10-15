import {
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  MessageCreateOptions,
  TextChannel,
} from "discord.js";
import { queueManager } from "../../services/queueManager";
import { restoreOldQueue } from "../../utils/helpers/restoreOldQueue";
import { delay } from "../../utils/helpers/utils";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import { musicPlayerMessage } from "../../services/musicPlayerMessage";
import { useQueue } from "discord-player";

export const enemiesSlainButton = new ButtonBuilder()
  .setCustomId("enemies_slain")
  .setLabel("🏆")
  .setStyle(ButtonStyle.Secondary);

export const execute = async (interaction: ButtonInteraction) => {
  await interaction.deferUpdate();
  const { guild } = interaction;
  if (!guild) {
    await interaction.reply("⚠️ No guild was found.");
    return;
  }

  const queue = useQueue();

  if (!queue) return;

  queue.node.stop();
  (queue.metadata as any).isSwithing = true;
  queue.delete();

  const stored = queueManager.retrieve(guild.id);

  if (!stored) {
    const data = buildEmbedMessage({
      title:
        "Nothing to restore, leaving voice chat. Please queue some new track(s) to resume playback!",
    });
    await musicPlayerMessage.delete();
    await (interaction.channel as TextChannel).send(
      data as MessageCreateOptions
    );
    return;
  }

  await delay(1000);

  const data = buildEmbedMessage({
    title: "Restoring old queue...",
    color: "info",
  });

  await (interaction.channel as TextChannel).send(data as MessageCreateOptions);

  await restoreOldQueue({
    guild,
    textChannel: interaction.channel ?? undefined,
    voiceChannel: stored.voiceChannel,
  });
};
