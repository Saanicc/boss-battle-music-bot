import * as playBossMusic from "./playBossMusic";
import * as addTrack from "./addTrack";
import * as play from "./play";
import * as help from "./help";
import * as queue from "./queue";
import * as skip from "./skip";
import * as rank from "./rank";
import * as leaderboard from "./leaderboard";

export const commands = {
  help,
  play,
  play_boss_music: playBossMusic,
  add_track: addTrack,
  queue,
  skip,
  rank,
  leaderboard,
};
