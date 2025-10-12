import {
  ActivityType,
  Client,
  GatewayIntentBits,
  Message,
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
import { updateNowPlayingMessage } from "./utils/helpers/updateNowPlayingMessage.js";
import { buildEmbedMessage } from "./utils/embeds/embedMessage.js";
import { SoundcloudExtractor } from "discord-player-soundcloud";
import { SpotifyExtractor } from "discord-player-spotify";
import { queueManager } from "./utils/queueManager.js";

let nowPlayingMessage: Message | undefined;
let progressInterval: NodeJS.Timeout | null = null;

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
  const queueType = queueManager.getQueueType();

  const data = buildNowPlayingMessage(track, true, queueType, queue);

  if (progressInterval) clearInterval(progressInterval);

  await nowPlayingMessage?.delete();

  nowPlayingMessage = await channel.send(data as MessageCreateOptions);

  progressInterval = setInterval(async () => {
    if (!queue.node.isPlaying()) return;

    const updateData = buildNowPlayingMessage(track, true, queueType, queue);
    try {
      await nowPlayingMessage?.edit(updateData as MessageEditOptions);
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  }, 1000);
});

player.events.on(GuildQueueEvent.PlayerPause, async (queue) => {
  await updateNowPlayingMessage(queue.currentTrack, false, nowPlayingMessage);
});

player.events.on(GuildQueueEvent.EmptyQueue, async (queue) => {
  const guildId = queue.guild.id;
  const stored = queueManager.retrieve(guildId);

  if (!stored) {
    queue.delete();
    return;
  }

  const voiceChannel = queue.metadata.voiceChannel;
  if (!voiceChannel || !voiceChannel.isVoiceBased()) {
    console.warn(`No valid voice channel to restore queue for ${guildId}.`);
    return;
  }

  const newQueue = player.nodes.create(queue.guild, {
    metadata: queue.metadata,
  });

  if (!stored.currentTrack) return;

  newQueue.addTrack(stored.currentTrack);

  for (const track of stored.tracks) {
    newQueue.addTrack(track);
  }

  queueManager.setQueueType("normal");

  await newQueue.connect(voiceChannel);
  await newQueue.node.play();

  queueManager.clear(guildId);
});

player.events.on(GuildQueueEvent.QueueDelete, async (queue) => {
  queueManager.setQueueType("normal");

  const channel = queue.metadata.channel;

  if (!channel) return;

  await nowPlayingMessage?.delete();

  const data = buildEmbedMessage({
    title: "Left the voice channel",
    color: "red",
  });

  await channel.send(data);

  nowPlayingMessage = undefined;
});
