/**
 * Adapted from: https://github.com/iTsMaaT/WD-40/tree/develop/utils/helpers/youtubei/getInnertube.js
 * Original author: iTsMaaT
 * License: MIT
 *
 * Converted from CommonJS to ES Modules and TypeScript.
 * Note: Type definitions are placeholders ('any').
 */

import { Innertube, Platform, UniversalCache } from "youtubei.js";

let ineerTubeInstance: any = null;

Platform.shim.eval = async (data: any, env) => {
  const properties = [];

  if (env.n) properties.push(`n: exportedVars.nFunction("${env.n}")`);

  if (env.sig) properties.push(`sig: exportedVars.sigFunction("${env.sig}")`);

  const code = `${data.output}\nreturn { ${properties.join(", ")} }`;

  return new Function(code)();
};

/**
 * Get the Innertube instance
 * @returns {Promise<Innertube>} The Innertube instance
 */
export async function getInnertube(options?: any) {
  if (!ineerTubeInstance) {
    ineerTubeInstance = await Innertube.create({
      cache: new UniversalCache(false),
      // player_id: "0004de42",
      cookie: process.env.YOUTUBE_COOKIE,
    });
  }
  return ineerTubeInstance;
}
