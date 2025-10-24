export type ColorType =
  | "nowPlaying"
  | "paused"
  | "queue"
  | "error"
  | "success"
  | "info"
  | "stopped"
  | "bossMode"
  | "default";

export type Colors = Record<ColorType, number>;

export const colors: Colors = {
  nowPlaying: 0x5865f2,
  paused: 0x7289da,
  queue: 0x3ba55d,
  error: 0xed4245,
  success: 0x57f287,
  info: 0x5865f2,
  stopped: 0x99aab5,
  bossMode: 0x9b51e0,
  default: 0x2b2d31,
};
