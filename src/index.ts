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
import { stopMusic } from "./interactions/buttons/stop.js";
import { pauseMusic } from "./interactions/buttons/pause.js";
import { startMusic } from "./interactions/buttons/start.js";

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
    if (interaction.customId.startsWith("start")) {
      await startMusic(interaction);
    }
    if (interaction.customId.startsWith("stop")) {
      await stopMusic(interaction);
    }
    if (interaction.customId.startsWith("pause")) {
      await pauseMusic(interaction);
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
    row.addComponents(
      new ButtonBuilder()
        .setCustomId("pause")
        .setLabel("Pause")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("stop")
        .setLabel("Stop")
        .setStyle(ButtonStyle.Danger)
    );

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
  row.addComponents(
    new ButtonBuilder()
      .setCustomId("start")
      .setLabel("Resume")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("stop")
      .setLabel("Stop")
      .setStyle(ButtonStyle.Danger)
  );

  await nowPlayingMessage?.edit({
    embeds: nowPlayingData?.embeds,
    components: [row],
  });
  await setBotActivity(client, "Music paused", ActivityType.Custom);
});

player.events.on("playerResume", async () => {
  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId("pause")
      .setLabel("Pause")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("stop")
      .setLabel("Stop")
      .setStyle(ButtonStyle.Danger)
  );

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
