import fs from "fs";
import path from "path";
import { Player, QueryType, Track } from "discord-player";
import { User } from "discord.js";

export const getBossTracks = async (
  jsonPath: string,
  player: Player,
  requestedBy: User
): Promise<Track[]> => {
  const fullPath = path.resolve(process.cwd(), jsonPath);
  const data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));

  const trackUrls = data.bossTracks;

  if (Array.isArray(trackUrls)) {
    if (trackUrls.length === 0) {
      throw new Error("⚠️ No track URLs found in JSON file!");
    }

    const tracks: Track[] = [];

    for (const url of trackUrls) {
      const result = await player.search(url, {
        requestedBy,
      });

      if (result.hasTracks()) {
        tracks.push(result.tracks[0]);
      } else {
        console.warn(`⚠️ No playable tracks found for: ${url}`);
      }
    }

    return tracks;
  } else {
    throw new Error("Invalid JSON format for boss music data.");
  }
};
