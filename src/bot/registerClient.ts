import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import { config } from "../config";
import { deployCommands } from "../deploy-commands";
import { setBotActivity } from "../utils/helpers/setBotActivity";
import { buttons } from "../interactions/buttons";
import { commands } from "../interactions/commands";
import { handleInteraction } from "../utils/helpers/handleInteraction";

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
    if (interaction.isChatInputCommand()) {
      const { commandName } = interaction;
      await handleInteraction(interaction, commands, commandName);
    }
    if (interaction.isButton()) {
      const button = interaction.customId;
      await handleInteraction(interaction, buttons, button);
    }
  });

  await client.login(config.DISCORD_TOKEN);

  return client;
};
