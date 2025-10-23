import { Message, MessageEditOptions, MessagePayload } from "discord.js";

let nowPlayingMessage: Message | undefined;
let progressInterval: NodeJS.Timeout | null = null;

export const musicPlayerMessage = {
  async set(message: typeof nowPlayingMessage) {
    nowPlayingMessage = message;
  },

  get() {
    return nowPlayingMessage;
  },

  async edit(data: string | MessageEditOptions | MessagePayload) {
    if (nowPlayingMessage) await nowPlayingMessage.edit(data);
  },

  async delete() {
    if (!nowPlayingMessage) return;

    await nowPlayingMessage.delete();
  },

  clearProgressInterval() {
    if (progressInterval) clearInterval(progressInterval);
  },

  setProgressInterval(interval: NodeJS.Timeout) {
    progressInterval = interval;
  },
};
