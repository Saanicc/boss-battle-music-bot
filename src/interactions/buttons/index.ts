import * as stop from "./stop";
import * as slayEnemies from "./slayEnemies";
import * as enemiesSlain from "./enemiesSlain";
import * as pause from "./pause";
import * as resume from "./resume";
import * as queue from "./queue";

export const buttons = {
  slay_enemies: slayEnemies,
  enemies_slain: enemiesSlain,
  pause,
  resume,
  stop,
  queue,
};
