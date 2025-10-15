import { queueManager } from "../../services/queueManager";
import { Guild, TextBasedChannel, VoiceBasedChannel } from "discord.js";
import { Player, Track, useMainPlayer } from "discord-player";

const reSearch = async (track: Track, player: Player) => {
  try {
    const result = await player.search(track.url ?? track.title, {
      requestedBy: track.requestedBy ?? undefined,
    });
    if (result.tracks.length) return result.tracks[0];
  } catch (err) {
    console.warn(`Failed to restore track: ${track.title}`, err);
  }
};

export const restoreOldQueue = async ({
  guild,
  textChannel,
  voiceChannel,
}: {
  guild: Guild;
  textChannel?: TextBasedChannel;
  voiceChannel?: VoiceBasedChannel;
}) => {
  const guildId = guild.id;
  const stored = queueManager.retrieve(guildId);

  if (!stored) {
    return;
  }

  if (!voiceChannel || !voiceChannel.isVoiceBased()) {
    console.warn(`No valid voice channel to restore queue for ${guildId}.`);
    return;
  }

  const player = useMainPlayer();

  const newQueue = player.nodes.create(guild, {
    metadata: { channel: textChannel, voiceChannel },
  });

  if (!newQueue.connection) await newQueue.connect(voiceChannel);

  let currentTrack = undefined;
  if (stored.currentTrack) {
    currentTrack = await reSearch(stored.currentTrack, player);
  }

  for (const track of stored.tracks) {
    const rebuilt = await reSearch(track, player);
    if (rebuilt) newQueue.addTrack(rebuilt);
  }

  if (currentTrack && stored.position)
    await newQueue.node.play(currentTrack, { seek: stored.position });
  else {
    await newQueue.node.play();
  }

  queueManager.clear(guildId);
};
