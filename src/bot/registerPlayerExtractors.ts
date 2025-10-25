import { Player } from "discord-player";
import { AttachmentExtractor } from "@discord-player/extractor";
import { SpotifyExtractor } from "discord-player-spotify";
import { SoundcloudExtractor } from "discord-player-soundcloud";
import { YoutubeSabrExtractor } from "../youtubei/youtubeiExtractor";
import { config } from "../config";

export const registerPlayerExtractors = async (player: Player) => {
  const spotifyExt = await player.extractors.register(SpotifyExtractor, {
    clientId: config.SPOTIFY_CLIENT_ID,
    clientSecret: config.SPOTIFY_CLIENT_SECRET,
    market: "SE",
  });
  const soundcloudExt = await player.extractors.register(
    SoundcloudExtractor,
    {}
  );
  const ytExt = await player.extractors.register(YoutubeSabrExtractor, {
    cookies: config.YOUTUBE_COOKIE,
    logSabrEvents: false,
  });
  const attatchmentExt = await player.extractors.register(
    AttachmentExtractor,
    {}
  );

  if (spotifyExt) {
    spotifyExt.priority = 2;
  }

  if (soundcloudExt) {
    soundcloudExt.priority = 1;
  }

  if (ytExt) {
    ytExt.priority = 3;
  }

  if (attatchmentExt) {
    attatchmentExt.priority = 0;
  }
};
