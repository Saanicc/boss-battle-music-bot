import {
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
import { Player, Track } from "discord-player";
import { AttachmentExtractor } from "@discord-player/extractor";
import { buttons } from "./interactions/buttons/index.js";
import { buildNowPlayingMessage } from "./utils/embeds/nowPlayingMessage.js";
import { BOT_STATUS, EMBED_COLORS } from "./utils/constants.js";
import { updateNowPlayingMessage } from "./utils/helpers/updateNowPlayingMessage.js";

let nowPlayingMessage: Message | undefined;
let nowPlayingData: MessageCreateOptions | MessageEditOptions | undefined;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once("clientReady", async () => {
  console.log(`🤖 Logged in as ${client.user?.tag}`);
  await setBotActivity(client, BOT_STATUS.idle.name, BOT_STATUS.idle.type);
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

player.events.on("playerStart", async (queue, track) => {
  const channel = queue.metadata.channel as TextChannel;
  const data = buildNowPlayingMessage(track, true);

  if (nowPlayingMessage) {
    await nowPlayingMessage.edit(data as MessageEditOptions);
    nowPlayingData = data;
  } else {
    nowPlayingMessage = await channel.send(data as MessageCreateOptions);
  }

  nowPlayingData = data;
  await setBotActivity(
    client,
    BOT_STATUS.playing.name,
    BOT_STATUS.playing.type
  );
});

player.events.on("playerPause", async (queue) => {
  await updateNowPlayingMessage(queue.currentTrack, false, nowPlayingMessage);
  await setBotActivity(client, BOT_STATUS.paused.name, BOT_STATUS.paused.type);
});

player.events.on("playerResume", async (queue) => {
  await updateNowPlayingMessage(queue.currentTrack, true, nowPlayingMessage);
  await setBotActivity(
    client,
    BOT_STATUS.playing.name,
    BOT_STATUS.playing.type
  );
});

player.events.on("queueDelete", async () => {
  const embed = {
    title: "Music stopped",
    description: "Queue cleared.\nDisconnecting...",
    color: EMBED_COLORS.red,
  };

  await nowPlayingMessage?.edit({
    embeds: [embed],
    components: [],
  });

  nowPlayingMessage = undefined;
  nowPlayingData = undefined;
  await setBotActivity(client, BOT_STATUS.idle.name, BOT_STATUS.idle.type);
});
