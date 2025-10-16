import { Track, useQueue } from "discord-player";

export const getFormattedTrackDescription = (track: Track | null) => {
  const queue = useQueue();

  if (!track || !queue) return "N/A";

  const totalTime = queue?.node.getTimestamp()?.total.label;

  let desc: string;

  if (track.url.match(/https:\/\/open.spotify.com\/track\/.*/)) {
    desc = `[${track.title}](${track.url}) by ${track.author}`;
  } else {
    desc = `[${track.title}](${track.url})`;
  }

  if (queue.currentTrack?.id === track.id) {
    return `${desc} [${totalTime}]`;
  }
  return desc;
};
