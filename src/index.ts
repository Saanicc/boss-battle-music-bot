import {
  ActivityType,
  Client,
  GatewayIntentBits,
  MessageCreateOptions,
  MessageEditOptions,
  TextChannel,
} from "discord.js";
import { deployCommands } from "./deploy-commands.js";
import { commands } from "./interactions/commands/index.js";
import { config } from "./config.js";
import { setBotActivity } from "./utils/helpers/setBotActivity.js";
import { GuildQueueEvent, Player } from "discord-player";
import { AttachmentExtractor } from "@discord-player/extractor";
import { buttons } from "./interactions/buttons/index.js";
import { buildNowPlayingMessage } from "./utils/embeds/nowPlayingMessage.js";
import { SoundcloudExtractor } from "discord-player-soundcloud";
import { SpotifyExtractor } from "discord-player-spotify";
import { musicPlayerMessage } from "./services/musicPlayerMesssage.js";
import { buildEmbedMessage } from "./utils/embeds/embedMessage.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once("clientReady", async () => {
  console.log(`🤖 Logged in as ${client.user?.tag}`);
  await setBotActivity(client, "/play_boss_music", ActivityType.Listening);
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
      commands[commandName as keyof typeof commands].execute(interaction);
    }
  }
  if (interaction.isButton()) {
    const button = interaction.customId;
    if (buttons[button as keyof typeof buttons]) {
      buttons[button as keyof typeof buttons].execute(interaction);
    }
  }
});

client.login(config.DISCORD_TOKEN);

// Discord-player
export const player = new Player(client);

const registerExtractors = async () => {
  await player.extractors.loadMulti([SoundcloudExtractor, SpotifyExtractor]);
  await player.extractors.register(AttachmentExtractor, {});
};
registerExtractors().catch(console.error);

player.events.on(GuildQueueEvent.PlayerStart, async (queue, track) => {
  const channel = queue.metadata.channel as TextChannel;

  const data = buildNowPlayingMessage(track, true, queue);

  musicPlayerMessage.clearProgressInterval();
  musicPlayerMessage.delete();

  const msg = await channel.send(data as MessageCreateOptions);
  musicPlayerMessage.set(msg);

  musicPlayerMessage.setProgressInterval(
    setInterval(async () => {
      if (!queue.node.isPlaying()) return;

      const updateData = buildNowPlayingMessage(track, true, queue);
      try {
        await musicPlayerMessage.edit(updateData as MessageEditOptions);
      } catch (err) {
        console.error("Failed to update progress:", err);
      }
    }, 1000)
  );
});

player.events.on(GuildQueueEvent.PlayerPause, async (queue) => {
  if (!queue.currentTrack) return;

  const data = buildNowPlayingMessage(queue.currentTrack, false, queue);

  await musicPlayerMessage.edit(data as MessageEditOptions);
});

player.events.on(GuildQueueEvent.QueueDelete, async (queue) => {
  await musicPlayerMessage.delete();
  musicPlayerMessage.set(undefined);

  const data = buildEmbedMessage({
    title: "Left the voice channel",
    color: "red",
  });

  const channel = queue.metadata.channel;
  await channel.send(data as MessageCreateOptions);
});
