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
import { EMBED_COLORS } from "./utils/constants/constants.js";
import { updateNowPlayingMessage } from "./utils/helpers/updateNowPlayingMessage.js";
import { buildEmbedMessage } from "./utils/embeds/embedMessage.js";

let nowPlayingMessage: Message | undefined;
let nowPlayingData: MessageCreateOptions | MessageEditOptions | undefined;

export const resetNowPlaying = async () => {
  if (nowPlayingMessage) {
    try {
      const data = buildEmbedMessage({
        title: "⚔️ A new battle has begun!",
        description: `🔁 Reshuffling queue`,
        color: "green",
      });
      await nowPlayingMessage.edit({ embeds: data.embeds, components: [] });
    } catch (err) {
      console.warn("Couldn't reset Now Playing message:", err);
    }
  }

  nowPlayingMessage = undefined;
  nowPlayingData = undefined;
};

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
player.extractors.register(AttachmentExtractor, {});

player.events.on(GuildQueueEvent.PlayerStart, async (queue, track) => {
  const channel = queue.metadata.channel as TextChannel;
  const data = buildNowPlayingMessage(track, true);

  if (nowPlayingMessage) {
    await nowPlayingMessage.edit(data as MessageEditOptions);
    nowPlayingData = data;
  } else {
    nowPlayingMessage = await channel.send(data as MessageCreateOptions);
  }

  nowPlayingData = data;
});

player.events.on(GuildQueueEvent.PlayerPause, async (queue) => {
  await updateNowPlayingMessage(queue.currentTrack, false, nowPlayingMessage);
});

player.events.on(GuildQueueEvent.QueueDelete, async () => {
  const embed = {
    title: "Left the voice channel",
    color: EMBED_COLORS.red,
  };

  await nowPlayingMessage?.edit({
    embeds: [embed],
    components: [],
  });

  nowPlayingMessage = undefined;
  nowPlayingData = undefined;
});
