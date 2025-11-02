import { Player } from "discord-player";
import { AttachmentExtractor } from "@discord-player/extractor";
import { SpotifyExtractor } from "discord-player-spotify";
import { SoundcloudExtractor } from "discord-player-soundcloud";
import { config } from "../config";
import { YoutubeExtractor } from "discord-player-youtube";

export const registerPlayerExtractors = async (player: Player) => {
  await player.extractors.register(SpotifyExtractor, {
    clientId: config.SPOTIFY_CLIENT_ID,
    clientSecret: config.SPOTIFY_CLIENT_SECRET,
    market: "SE",
  });
  await player.extractors.register(YoutubeExtractor, {});
  await player.extractors.register(SoundcloudExtractor, {});
  await player.extractors.register(AttachmentExtractor, {});
};
