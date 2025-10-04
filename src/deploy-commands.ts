import { REST, Routes } from "discord.js";
import { commands } from "./interactions/commands/index";
import { config } from "./config";

const commandsData = Object.values(commands).map((command) => command.data);

// Register slash commands
const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export const deployCommands = async ({ guildId }: DeployCommandsProps) => {
  try {
    console.log("Registering application (/) commands.");

    // Register globally (takes up to 1 hour to appear everywhere)
    // await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    //   body: commands,
    // });

    // Or register per-guild (instant, good for testing):
    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
      { body: commandsData }
    );

    console.log("Successfully registered application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
