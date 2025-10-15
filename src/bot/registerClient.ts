import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import { useMainPlayer } from "discord-player";
import { config } from "../config";
import { deployCommands } from "../deploy-commands";
import { setBotActivity } from "../utils/helpers/setBotActivity";
import { buttons } from "../interactions/buttons";
import { commands } from "../interactions/commands";

export const registerDiscordClient = async () => {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  });

  client.once("clientReady", async () => {
    console.log(`🤖 Logged in as ${client.user?.tag}`);
    await setBotActivity(client, "/help", ActivityType.Listening);
  });

  client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
  });

  client.on("interactionCreate", async (interaction) => {
    const player = useMainPlayer();

    const handleInteraction = async (
      collection: Record<string, { execute: (i: any) => Promise<any> }>,
      key: string
    ) => {
      if (!interaction.guild) return;

      const handler = collection[key as keyof typeof collection];
      if (!handler) return;

      const context = {
        guild: interaction.guild,
      };
      await player.context.provide(context, () => handler.execute(interaction));
    };

    if (interaction.isChatInputCommand()) {
      const { commandName } = interaction;
      await handleInteraction(commands, commandName);
    }
    if (interaction.isButton()) {
      const button = interaction.customId;
      await handleInteraction(buttons, button);
    }
  });

  await client.login(config.DISCORD_TOKEN);

  return client;
};
