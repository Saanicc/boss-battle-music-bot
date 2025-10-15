import { Client } from "discord.js";
import { config } from "../config.js";
import { Player } from "discord-player";
import { AttachmentExtractor } from "@discord-player/extractor";
import { SoundcloudExtractor } from "discord-player-soundcloud";
import { SpotifyExtractor } from "discord-player-spotify";

export const registerPlayer = async (discordClient: Client) => {
  const player = new Player(discordClient);

  await player.extractors.register(SpotifyExtractor, {
    clientId: config.SPOTIFY_CLIENT_ID,
    clientSecret: config.SPOTIFY_CLIENT_SECRET,
    market: "SE",
  });
  await player.extractors.register(SoundcloudExtractor, {});
  await player.extractors.register(AttachmentExtractor, {});

  return player;
};
