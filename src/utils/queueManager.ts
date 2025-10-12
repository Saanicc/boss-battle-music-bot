import { Track } from "discord-player";

interface StoredQueue {
  tracks: Track[];
  currentTrack?: Track;
  position?: number;
}

export type QueueType = "normal" | "boss";

const storedQueues = new Map<string, StoredQueue>();
let queueType: QueueType = "normal";

export const queueManager = {
  store(guildId: string, tracks: Track[], currentTrack?: Track) {
    storedQueues.set(guildId, {
      tracks,
      currentTrack,
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
