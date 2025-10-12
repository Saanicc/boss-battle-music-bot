import { Track } from "discord-player";
import { VoiceChannel } from "discord.js";

interface StoredQueue {
  tracks: Track[];
  currentTrack?: Track;
  position?: number;
  voiceChannel?: VoiceChannel;
}

export type QueueType = "normal" | "boss";

const storedQueues = new Map<string, StoredQueue>();
let queueType: QueueType = "normal";

export const queueManager = {
  store(
    guildId: string,
    tracks: Track[],
    currentTrack?: Track,
    position?: number,
    voiceChannel?: VoiceChannel
  ) {
    storedQueues.set(guildId, {
      tracks,
      currentTrack,
      position,
      voiceChannel,
    });
  },

  retrieve(guildId: string): StoredQueue | undefined {
    return storedQueues.get(guildId);
  },

  clear(guildId: string) {
    storedQueues.delete(guildId);
  },
  setQueueType(type: QueueType) {
    queueType = type;
  },
  getQueueType() {
    return queueType;
  },
};
