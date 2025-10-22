import mongoose from "mongoose";
import { registerDiscordClient } from "./bot/registerClient.js";
import { registerPlayer } from "./bot/registerPlayer.js";
import { config } from "./config.js";

const setupBot = async () => {
  mongoose
    .connect(config.MONGO_URI)
    .then(() => {
      console.log("Connected to Mongo DB");
    })
    .catch((err) => {
      console.error("MongoDB connection error: ", err);
    });

  const client = registerDiscordClient();
  registerPlayer(client);
  client.login(config.DISCORD_TOKEN);
};

setupBot();

process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
});
