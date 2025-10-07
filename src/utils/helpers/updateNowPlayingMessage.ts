import { Track } from "discord-player";
import { Message, MessageEditOptions } from "discord.js";
import { buildNowPlayingMessage } from "../embeds/nowPlayingMessage";

export const updateNowPlayingMessage = async (
  currentTrack: Track | null,
  isPlaying: boolean,
  nowPlayingMessage: Message | undefined
) => {
  const track = currentTrack;
  if (!track) {
    return;
  }

  const data = buildNowPlayingMessage(track, isPlaying ? true : false);
  if (nowPlayingMessage) {
    await nowPlayingMessage.edit(data as MessageEditOptions);
  }
};
