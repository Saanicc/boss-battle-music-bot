import { Track } from "discord-player";
import { VoiceChannel } from "discord.js";

export type QueueType = "normal" | "boss";

interface StoredQueue {
  tracks: Track[];
  queueType: QueueType;
  currentTrack?: Track;
  position?: number;
  voiceChannel?: VoiceChannel;
}

const storedQueues = new Map<string, StoredQueue>();
let queueType: QueueType = "normal";

export const queueManager = {
  store(
    guildId: string,
    tracks: Track[],
    queueType: QueueType,
    currentTrack?: Track,
    position?: number,
    voiceChannel?: VoiceChannel
  ) {
    storedQueues.set(guildId, {
      tracks,
      queueType,
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
    this.setQueueType("normal");
  },

  setQueueType(type: QueueType) {
    queueType = type;
  },

  getQueueType() {
    return queueType;
  },
};
