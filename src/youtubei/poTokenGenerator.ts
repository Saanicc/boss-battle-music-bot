/**
 * Adapted from: https://github.com/iTsMaaT/WD-40/blob/develop/utils/helpers/youtubei/poTokenGenerator.js
 * Original author: iTsMaaT
 * License: MIT
 *
 * Converted from CommonJS to ES Modules and TypeScript.
 * Note: Type definitions are placeholders ('any').
 */

import { BG, GOOG_API_KEY, USER_AGENT, buildURL } from "bgutils-js";
import { JSDOM } from "jsdom";
import { createCanvas, ImageData as CanvasImageData } from "@napi-rs/canvas";

const REQUEST_KEY = "O43z0dpjhgX20SCx4KAo";

let domWindow: any;
let initializationPromise: any = null;
let botguardClient: any;
let webPoMinter: any;
let activeScriptId: any = null;
let canvasPatched = false;

function patchCanvasSupport(window: any) {
  if (canvasPatched) return;

  const HTMLCanvasElement = window?.HTMLCanvasElement;
  if (!HTMLCanvasElement) return;

  Object.defineProperty(HTMLCanvasElement.prototype, "_napiCanvasState", {
    configurable: true,
    enumerable: false,
    writable: true,
    value: null,
  });

  HTMLCanvasElement.prototype.getContext = function getContext(
    type: any,
    options: any
  ) {
    if (type !== "2d") return null;

    const width =
      Number.isFinite(this.width) && this.width > 0 ? this.width : 300;
    const height =
      Number.isFinite(this.height) && this.height > 0 ? this.height : 150;

    const state = this._napiCanvasState || {};

    if (!state.canvas) {
      state.canvas = createCanvas(width, height);
    } else if (state.canvas.width !== width || state.canvas.height !== height) {
      state.canvas.width = width;
      state.canvas.height = height;
    }

    state.context = state.canvas.getContext("2d", options);
    this._napiCanvasState = state;
    return state.context;
  };

  HTMLCanvasElement.prototype.toDataURL = function toDataURL(...args: any) {
    if (!this._napiCanvasState?.canvas) {
      const width =
        Number.isFinite(this.width) && this.width > 0 ? this.width : 300;
      const height =
        Number.isFinite(this.height) && this.height > 0 ? this.height : 150;
      this._napiCanvasState = {
        canvas: createCanvas(width, height),
        context: null,
      };
    }

    return this._napiCanvasState.canvas.toDataURL(...args);
  };

  if (!window.ImageData) window.ImageData = CanvasImageData;

  if (!Reflect.has(globalThis, "ImageData")) {
    Object.defineProperty(globalThis, "ImageData", {
      configurable: true,
      enumerable: false,
      writable: true,
      value: CanvasImageData,
    });
  }

  canvasPatched = true;
}

function ensureDomEnvironment(userAgent: any) {
  if (domWindow) return domWindow;

  const dom = new JSDOM(
    "<!DOCTYPE html><html><head></head><body></body></html>",
    {
      url: "https://www.youtube.com/",
      referrer: "https://www.youtube.com/",
      userAgent,
    }
  );

  domWindow = dom.window;

  const globalAssignments = {
    window: domWindow,
    document: domWindow.document,
    location: domWindow.location,
    origin: domWindow.origin,
    navigator: domWindow.navigator,
    HTMLElement: domWindow.HTMLElement,
    atob: domWindow.atob,
    btoa: domWindow.btoa,
    crypto: domWindow.crypto,
    performance: domWindow.performance,
  };

  for (const [key, value] of Object.entries(globalAssignments)) {
    if (!Reflect.has(globalThis, key)) {
      Object.defineProperty(globalThis, key, {
        configurable: true,
        enumerable: false,
        writable: true,
        value,
      });
    }
  }

  if (!Reflect.has(globalThis, "self")) {
    Object.defineProperty(globalThis, "self", {
      configurable: true,
      enumerable: false,
      writable: true,
      value: globalThis,
    });
  }

  patchCanvasSupport(domWindow);

  return domWindow;
}

function resetBotguardState() {
  if (botguardClient?.shutdown) {
    try {
      botguardClient.shutdown();
    } catch {
      /* no-op */
    }
  }

  if (activeScriptId && domWindow?.document)
    domWindow.document.getElementById(activeScriptId)?.remove();

  botguardClient = undefined;
  webPoMinter = undefined;
  activeScriptId = null;
  initializationPromise = null;
}

async function initializeBotguard(innertube: any, { forceRefresh }: any = {}) {
  if (forceRefresh) resetBotguardState();

  if (webPoMinter) return webPoMinter;

  if (initializationPromise) return await initializationPromise;

  const userAgent = innertube.session.context.client.userAgent || USER_AGENT;
  ensureDomEnvironment(userAgent);

  initializationPromise = (async () => {
    const challengeResponse = await innertube.getAttestationChallenge(
      "ENGAGEMENT_TYPE_UNBOUND"
    );
    const challenge = challengeResponse?.bg_challenge;

    if (!challenge) throw new Error("Failed to retrieve Botguard challenge.");

    const interpreterUrl =
      challenge.interpreter_url
        ?.private_do_not_access_or_else_trusted_resource_url_wrapped_value;

    if (!interpreterUrl)
      throw new Error("Botguard challenge did not provide an interpreter URL.");

    if (!domWindow.document.getElementById(interpreterUrl)) {
      const interpreterResponse = await fetch(`https:${interpreterUrl}`, {
        headers: {
          "user-agent": userAgent,
        },
      });

      const interpreterJavascript = await interpreterResponse.text();

      if (!interpreterJavascript)
        throw new Error("Failed to download Botguard interpreter script.");

      const script = domWindow.document.createElement("script");
      script.type = "text/javascript";
      script.id = interpreterUrl;
      script.textContent = interpreterJavascript;
      domWindow.document.head.appendChild(script);
      activeScriptId = script.id;

      const executeInterpreter = new domWindow.Function(interpreterJavascript);
      executeInterpreter.call(domWindow);
    }

    botguardClient = await BG.BotGuardClient.create({
      program: challenge.program,
      globalName: challenge.global_name,
      globalObj: globalThis,
    });

    const webPoSignalOutput: any = [];
    const botguardSnapshot = await botguardClient.snapshot({
      webPoSignalOutput,
    });

    const integrityResponse = await fetch(buildURL("GenerateIT", true), {
      method: "POST",
      headers: {
        "content-type": "application/json+protobuf",
        "x-goog-api-key": GOOG_API_KEY,
        "x-user-agent": "grpc-web-javascript/0.1",
        "user-agent": userAgent,
      },
      body: JSON.stringify([REQUEST_KEY, botguardSnapshot]),
    });

    const integrityPayload = await integrityResponse.json();
    const integrityToken = integrityPayload?.[0];

    if (typeof integrityToken !== "string")
      throw new Error("Botguard integrity token generation failed.");

    webPoMinter = await BG.WebPoMinter.create(
      { integrityToken },
      webPoSignalOutput
    );

    return webPoMinter;
  })()
    .catch((error) => {
      resetBotguardState();
      throw error;
    })
    .finally(() => {
      initializationPromise = null;
    });

  return await initializationPromise;
}

function requireBinding(binding: any) {
  if (!binding)
    throw new Error("Content binding is required to mint a WebPO token.");
  return binding;
}

export async function getWebPoMinter(innertube: any, options: any = {}) {
  const minter = await initializeBotguard(innertube, options);

  return {
    generatePlaceholder(binding: any) {
      return BG.PoToken.generateColdStartToken(requireBinding(binding));
    },
    async mint(binding: any) {
      return await minter.mintAsWebsafeString(requireBinding(binding));
    },
  };
}

export function invalidateWebPoMinter() {
  resetBotguardState();
}

/**
 * Generates Data Sync tokens required for content PO token minting.
 *
 * @param {Innertube} innertube - The Innertube instance.
 * @returns {Promise<{dataSyncId: string, fullToken: string}>} The Data Sync ID and full token.
 */
export async function generateDataSyncTokens(innertube: any) {
  try {
    const accountInfo = await innertube.account.getInfo();
    console.log(accountInfo);
    const dataSyncId =
      accountInfo.contents.contents[0].endpoint.payload.supportedTokens[2]
        .datasyncIdToken.datasyncIdToken;

    if (!dataSyncId) throw new Error("Data Sync ID not found in account info");

    console.log("Data Sync ID:", dataSyncId);
    const minter = await getWebPoMinter(innertube);

    const fullToken = await minter.mint(dataSyncId);
    console.log("Full Token:", fullToken);

    return {
      dataSyncId,
      fullToken,
    };
  } catch (error) {
    console.error("Error generating Data Sync tokens:", error);
    throw error;
  }
}
