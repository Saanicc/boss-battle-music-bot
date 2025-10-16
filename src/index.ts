import { registerDiscordClient } from "./bot/registerClient.js";
import { registerPlayer } from "./bot/registerPlayer.js";

const setupBot = async () => {
  const client = registerDiscordClient();
  registerPlayer(client);
};

setupBot();

process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
});
