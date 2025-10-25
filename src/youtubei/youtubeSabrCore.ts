/**
 * Adapted from: https://github.com/iTsMaaT/WD-40/blob/develop/utils/helpers/youtubei/youtubeSabrCore.js
 * Original author: iTsMaaT
 * License: MIT
 *
 * Converted from CommonJS to ES Modules and TypeScript.
 * Note: Type definitions are placeholders ('any').
 */

import { Constants, YTNodes } from "youtubei.js";
// @ts-ignore
import { EnabledTrackTypes, buildSabrFormat } from "googlevideo/utils";
// @ts-ignore
import { SabrStream } from "googlevideo/sabr-stream";
import { Readable, PassThrough } from "stream";
import { once } from "events";
import {
  getWebPoMinter,
  invalidateWebPoMinter,
  generateDataSyncTokens,
} from "./poTokenGenerator.js";
import { getInnertube } from "./getInnertube.js";

const DEFAULT_OPTIONS = {
  audioQuality: "AUDIO_QUALITY_MEDIUM",
  enabledTrackTypes: EnabledTrackTypes.AUDIO_ONLY,
};

/**
 * Converts a stream to a Node.js Readable stream
 *
 * @param {ReadableStream} stream - The stream to convert
 * @returns {Readable} The Node.js Readable stream
 */
function toNodeReadable(stream: ReadableStream): Readable {
  const nodeStream = new PassThrough();
  const reader = stream.getReader();

  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          if (!nodeStream.write(Buffer.from(value)))
            await once(nodeStream, "drain");
        }
      }
    } finally {
      nodeStream.end();
    }
  })();

  return nodeStream;
}

/**
 * Creates a SABR stream for a given video ID
 *
 * @param {string} videoId - The video ID
 * @returns {Promise<Readable>} The SABR stream
 */
export async function createSabrStream(
  videoId: string,
  cookies: any,
  logSabrEvents = false
): Promise<Readable> {
  const innertube = await getInnertube(cookies);
  let accountInfo = null;

  // === Mint initial PO token ===
  try {
    accountInfo = await innertube.account.getInfo();
  } catch (e) {
    accountInfo = null;
  }
  const dataSyncId =
    accountInfo?.contents?.contents[0]?.endpoint?.payload?.supportedTokens?.[2]
      ?.datasyncIdToken?.datasyncIdToken ??
    innertube.session.context.client.visitorData;
  const minter = await getWebPoMinter(innertube);
  const contentPoToken = await minter.mint(videoId);
  const poToken = await minter.mint(dataSyncId);

  // === Player request ===
  const watchEndpoint = new YTNodes.NavigationEndpoint({
    watchEndpoint: { videoId },
  });
  const playerResponse = await watchEndpoint.call(innertube.actions, {
    playbackContext: {
      adPlaybackContext: { pyv: true },
      contentPlaybackContext: {
        vis: 0,
        splay: false,
        lactMilliseconds: "-1",
        signatureTimestamp: innertube.session.player?.signature_timestamp,
      },
    },
    contentCheckOk: true,
    racyCheckOk: true,
    serviceIntegrityDimensions: { poToken: poToken },
    parse: true,
  });

  const serverAbrStreamingUrl = await innertube.session.player?.decipher(
    playerResponse.streaming_data?.server_abr_streaming_url
  );
  const videoPlaybackUstreamerConfig =
    playerResponse.player_config?.media_common_config
      .media_ustreamer_request_config?.video_playback_ustreamer_config;

  if (!videoPlaybackUstreamerConfig)
    throw new Error("ustreamerConfig not found");
  if (!serverAbrStreamingUrl)
    throw new Error("serverAbrStreamingUrl not found");

  const sabrFormats =
    playerResponse.streaming_data?.adaptive_formats.map(buildSabrFormat) || [];

  const serverAbrStream = new SabrStream({
    formats: sabrFormats,
    serverAbrStreamingUrl,
    videoPlaybackUstreamerConfig,
    poToken: contentPoToken,
    clientInfo: {
      clientName: parseInt(
        Constants.CLIENT_NAME_IDS[
          innertube.session.context.client
            .clientName as keyof typeof Constants.CLIENT_NAME_IDS
        ]
      ),
      clientVersion: innertube.session.context.client.clientVersion,
    },
  });

  // === Stream protection handling ===
  let protectionFailureCount = 0;
  let lastStatus: any = null;
  serverAbrStream.on(
    "streamProtectionStatusUpdate",
    async (statusUpdate: any) => {
      if (statusUpdate.status !== lastStatus) {
        if (logSabrEvents)
          console.log("Stream Protection Status Update:", statusUpdate);
        lastStatus = statusUpdate.status;
      }
      if (statusUpdate.status === 2) {
        protectionFailureCount = Math.min(protectionFailureCount + 1, 10);
        if (protectionFailureCount === 1 || protectionFailureCount % 5 === 0)
          if (logSabrEvents)
            console.log(
              `Rotating PO token... (attempt ${protectionFailureCount})`
            );

        try {
          const rotationMinter = await getWebPoMinter(innertube, {
            forceRefresh: protectionFailureCount >= 3,
          });
          const placeholderToken = rotationMinter.generatePlaceholder(videoId);
          serverAbrStream.setPoToken(placeholderToken);
          const mintedPoToken = await rotationMinter.mint(videoId);
          serverAbrStream.setPoToken(mintedPoToken);
        } catch (err) {
          if (protectionFailureCount === 1 || protectionFailureCount % 5 === 0)
            if (logSabrEvents) console.error("Failed to rotate PO token:", err);
        }
      } else if (statusUpdate.status === 3) {
        if (logSabrEvents)
          console.error(
            "Stream protection rejected token (SPS 3). Resetting Botguard."
          );
        invalidateWebPoMinter();
      } else {
        protectionFailureCount = 0;
      }
    }
  );

  serverAbrStream.on("error", (err: any) => {
    if (logSabrEvents) console.error("SABR stream error:", err);
  });

  // === Start SABR stream ===
  const { audioStream } = await serverAbrStream.start(DEFAULT_OPTIONS);
  const nodeStream = toNodeReadable(audioStream);

  return nodeStream;
}
