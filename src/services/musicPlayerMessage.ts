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
    if (nowPlayingMessage) return await nowPlayingMessage.edit(data);
  },

  async delete() {
    if (!nowPlayingMessage) return;

    await nowPlayingMessage.delete();
    nowPlayingMessage = undefined;
    return;
  },

  clearProgressInterval() {
    if (progressInterval) clearInterval(progressInterval);
  },

  setProgressInterval(interval: NodeJS.Timeout) {
    progressInterval = interval;
  },
};
