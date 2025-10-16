import { User } from "discord.js";
import path from "path";
import fs from "fs";
import { Player, QueryType, Track } from "discord-player";
import { SoundcloudExtractor } from "discord-player-soundcloud";
import { SpotifyExtractor } from "discord-player-spotify";
import { YoutubeSabrExtractor } from "../../youtubei/youtubeiExtractor";

export const getAllMusicFiles = async (
  searchPath: string,
  player: Player,
  requestedBy: User
) => {
  const musicDir = path.join(process.cwd(), searchPath);
  const files = fs
    .readdirSync(musicDir)
    .filter(
      (f) => f.endsWith(".mp3") || f.endsWith(".flac") || f.endsWith(".wav")
    );

  if (files.length === 0) {
    throw new Error(`⚠️ No music files found in /${searchPath} folder!`);
  }

  const filePaths = files.map((f) => path.resolve(musicDir, f));

  const tracks: Track[] = [];

  for (const filePath of filePaths) {
    const result = await player.search(filePath, {
      requestedBy,
      searchEngine: QueryType.FILE,
      blockExtractors: [
        SoundcloudExtractor.identifier,
        SpotifyExtractor.identifier,
        YoutubeSabrExtractor.identifier,
      ],
    });
    if (result.hasTracks()) {
      tracks.push(result.tracks[0]);
    }
  }

  return tracks;
};
