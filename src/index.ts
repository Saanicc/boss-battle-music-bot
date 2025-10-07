import {
  ActionRowBuilder,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
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
import { Player } from "discord-player";
import { AttachmentExtractor } from "@discord-player/extractor";
import { buttons } from "./interactions/buttons/index.js";
import { pauseButton } from "./interactions/buttons/pause.js";
import { stopButton } from "./interactions/buttons/stop.js";
import { resumeButton } from "./interactions/buttons/resume.js";

let nowPlayingMessage: Message | undefined;
let nowPlayingData: MessageCreateOptions | MessageEditOptions | undefined;

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

player.events.on("playerStart", async (queue, track) => {
  const channel = queue.metadata.channel as TextChannel;

  if (nowPlayingMessage) {
    const data = {
      embeds: [
        {
          title: "Now Playing 🎶",
          description: `**${track.title}**`,
          fields: [
            {
              name: "Requested by",
              value: track.requestedBy?.toString() ?? "Unknown",
              inline: true,
            },
            { name: "Duration", value: track.duration, inline: true },
          ],
          color: 0x1db954,
        },
      ],
    } as MessageEditOptions;
    await nowPlayingMessage.edit(data);
    nowPlayingData = data;
  } else {
    const row = new ActionRowBuilder<ButtonBuilder>();
    row.addComponents(pauseButton, stopButton);

    const data = {
      embeds: [
        {
          title: "Now Playing 🎶",
          description: `**${track.title}**`,
          fields: [
            {
              name: "Requested by",
              value: track.requestedBy?.toString() ?? "Unknown",
              inline: true,
            },
            { name: "Duration", value: track.duration, inline: true },
          ],
          color: 0x1db954,
        },
      ],
      components: [row],
    } as MessageCreateOptions;

    const msg = await channel.send(data);

    nowPlayingMessage = msg;
    nowPlayingData = data;
  }
  await setBotActivity(client, "EPIC boss music", ActivityType.Listening);
});

player.events.on("playerPause", async () => {
  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(resumeButton, stopButton);

  await nowPlayingMessage?.edit({
    embeds: nowPlayingData?.embeds,
    components: [row],
  });
  await setBotActivity(client, "Music paused", ActivityType.Custom);
});

player.events.on("playerResume", async () => {
  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(pauseButton, stopButton);

  await nowPlayingMessage?.edit({
    embeds: nowPlayingData?.embeds,
    components: [row],
  });
  await setBotActivity(client, "EPIC boss music", ActivityType.Listening);
});

player.events.on("queueDelete", async () => {
  nowPlayingMessage = undefined;
  nowPlayingData = undefined;
  await setBotActivity(client, "/play_boss_music", ActivityType.Listening);
});
