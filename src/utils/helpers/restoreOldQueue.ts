import { GuildQueue } from "discord-player";
import { queueManager } from "../queueManager";
import { player } from "../..";
import { Guild, TextBasedChannel, VoiceBasedChannel } from "discord.js";

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

  const newQueue = player.nodes.create(guild, {
    metadata: { channel: textChannel, voiceChannel, isBoss: false },
  });

  if (!stored.currentTrack) return;

  newQueue.addTrack(stored.currentTrack);

  for (const track of stored.tracks) {
    newQueue.addTrack(track);
  }

  queueManager.setQueueType("normal");

  await newQueue.connect(voiceChannel);
  if (stored.currentTrack && stored.position)
    await newQueue.node.play(stored.currentTrack, { seek: stored.position });
  else {
    await newQueue.node.play();
  }
  queueManager.clear(guildId);
};
