import { registerDiscordClient } from "./bot/registerClient.js";
import { registerPlayer } from "./bot/registerPlayer.js";
import { registerPlayerEvents } from "./bot/registerPlayerEvents.js";

const setupBot = async () => {
  const client = await registerDiscordClient();
  const player = await registerPlayer(client);
  registerPlayerEvents(player);
};

setupBot();
