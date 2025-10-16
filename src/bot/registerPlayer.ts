import { Client } from "discord.js";
import { Player } from "discord-player";
import { registerPlayerExtractors } from "./registerPlayerExtractors.js";
import { registerPlayerEvents } from "./registerPlayerEvents.js";

export const registerPlayer = async (discordClient: Client) => {
  const player = new Player(discordClient);
  await registerPlayerExtractors(player).catch(console.error);
  registerPlayerEvents(player);
};
