import { Track } from "discord-player";

export const getFormattedTrackTitle = (track: Track | null) => {
  if (!track) return "N/A";

  if (track.url.includes("https://")) {
    return `[${track.title}](${track.url})`;
  }

  return track.title;
};
