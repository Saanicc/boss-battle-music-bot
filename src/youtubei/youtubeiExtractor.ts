/**
 * Adapted from: https://github.com/iTsMaaT/WD-40/blob/develop/utils/helpers/youtubei/youtubeiExtractor.js
 * Original author: iTsMaaT
 * License: MIT
 *
 * Converted from CommonJS to ES Modules and TypeScript.
 * Note: Type definitions are placeholders ('any').
 */

// YoutubeSabrExtractor.js
import {
  BaseExtractor,
  Track,
  Playlist,
  Util,
  TrackSource,
} from "discord-player";
import { createSabrStream } from "./youtubeSabrCore";
import { getInnertube } from "./getInnertube.js";

/**
 * Discord-player extractor using only helpers from youtubeSabrCore.js.
 */
export class YoutubeSabrExtractor extends BaseExtractor {
  static identifier = "com.itsmaat.discord-player.youtube-sabr";
  innertube: any;
  _stream: any;
  cookies: any;
  options: any;
  logSabrEvents: any;

  async activate() {
    this.protocols = ["youtube", "yt"];
    this.cookies = this.options.cookies;
    this.logSabrEvents = this.options.logSabrEvents;
    this.innertube = await getInnertube(this.cookies);

    const fn = (this.options as any).createStream;
    if (typeof fn === "function") {
      this._stream = (q: any) => {
        return fn(this, q);
      };
    }
  }

  async deactivate() {
    this._stream = null;
    this.innertube = null;
  }

  async validate(query: any, queryType: any) {
    if (typeof query !== "string") return false;
    return (
      !isUrl(query) ||
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(query)
    );
  }

  async handle(query: any, context: any) {
    try {
      if (!isUrl(query)) {
        const search = await this.innertube.search(query);
        const videos = search.videos.filter((v: any) => v.type === "Video");

        const tracks = [];
        for (const video of videos.slice(0, 10)) {
          const info = await this.innertube.getBasicInfo(video.id);
          const durationMs = (info.basic_info?.duration ?? 0) * 1000;

          tracks.push(
            new Track(context.player, {
              title: info.basic_info?.title ?? `YouTube:${video.id}`,
              author: info.basic_info?.author ?? null,
              url: `https://www.youtube.com/watch?v=${video.id}`,
              thumbnail: video.thumbnails[0]?.url,
              duration: Util.buildTimeCode(Util.parseMS(durationMs)),
              source: "youtube-sabr" as TrackSource,
              requestedBy: context.requestedBy ?? null,
              raw: {
                basicInfo: info,
                live: info.basic_info?.is_live || false,
              },
            })
          );
        }

        return this.createResponse(null, tracks);
      }
      let isPlaylist = false;
      let playlistId = null;
      const urlObj = new URL(query);
      const hasList = urlObj.searchParams.has("list");
      const isShortLink = /(^|\.)youtu\.be$/i.test(urlObj.hostname);
      isPlaylist = hasList && !isShortLink;
      playlistId = isPlaylist ? urlObj.searchParams.get("list") : null;

      // If playlist detected
      if (isPlaylist && playlistId) {
        let playlist = await this.innertube.getPlaylist(playlistId);
        if (!playlist?.videos?.length) return this.createResponse(null, []);

        const dpPlaylist = new Playlist(context.player, {
          id: playlistId,
          title: playlist.info.title ?? "Unknown",
          url: query,
          thumbnail: playlist.info.thumbnails[0].url,
          description:
            playlist.info.description ??
            playlist.info.title ??
            "UNKNOWN DESCRIPTION",
          source: "youtube",
          type: "playlist",
          author: {
            name:
              playlist?.channels[0]?.author?.name ??
              playlist.info.author.name ??
              "UNKNOWN AUTHOR",
            url:
              playlist?.channels[0]?.author?.url ??
              playlist.info.author.url ??
              "UNKNOWN AUTHOR",
          },
          tracks: [],
          // requestedBy: context.requestedBy ?? null,
        });

        dpPlaylist.tracks = [];

        const plTracks = playlist.videos
          .filter((v: any) => v.type === "PlaylistVideo")
          .map((v: any) => {
            const duration = Util.buildTimeCode(
              Util.parseMS(v.duration.seconds * 1000)
            );
            const raw = {
              duration_ms: v.duration.seconds * 1000,
              live: v.is_live,
              duration,
            };

            return new Track(this.context.player, {
              title: v.title.text ?? "UNKNOWN TITLE",
              duration: duration,
              thumbnail: v.thumbnails[0]?.url,
              author: v.author.name,
              requestedBy: context.requestedBy,
              url: `https://youtube.com/watch?v=${v.id}`,
              raw,
              playlist: dpPlaylist,
              source: "youtube",
              queryType: "youtubeVideo",
              async requestMetadata() {
                return this.raw;
              },
              metadata: raw,
              live: v.is_live,
            });
          });

        while (playlist.has_continuation) {
          playlist = await playlist.getContinuation();

          plTracks.push(
            ...playlist.videos
              .filter((v: any) => v.type === "PlaylistVideo")
              .map((v: any) => {
                const duration = Util.buildTimeCode(
                  Util.parseMS(v.duration.seconds * 1000)
                );
                const raw = {
                  duration_ms: v.duration.seconds * 1000,
                  live: v.is_live,
                  duration,
                };

                return new Track(this.context.player, {
                  title: v.title.text ?? "UNKNOWN TITLE",
                  duration,
                  thumbnail: v.thumbnails[0]?.url,
                  author: v.author.name,
                  requestedBy: context.requestedBy,
                  url: `https://youtube.com/watch?v=${v.id}`,
                  raw,
                  playlist: dpPlaylist,
                  source: "youtube",
                  queryType: "youtubeVideo",
                  async requestMetadata() {
                    return this.raw;
                  },
                  metadata: raw,
                  live: v.is_live,
                });
              })
          );
        }

        dpPlaylist.tracks = plTracks;

        return this.createResponse(dpPlaylist, plTracks);
      }

      // Otherwise treat as single video
      const videoId = extractVideoId(query);
      if (!videoId) return this.createResponse(null, []);

      const info = await this.innertube.getBasicInfo(videoId);
      const durationMs = (info.basic_info?.duration ?? 0) * 1000;

      const trackObj = new Track(context.player, {
        title: info.basic_info?.title ?? `YouTube:${videoId}`,
        author: info.basic_info?.author ?? null,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        duration: Util.buildTimeCode(Util.parseMS(durationMs)),
        thumbnail: info.basic_info?.thumbnail[0]?.url,
        source: "youtube-sabr" as TrackSource,
        requestedBy: context.requestedBy ?? null,
        raw: {
          basicInfo: info,
          live: info.basic_info?.is_live || false,
        },
      });

      return this.createResponse(null, [trackObj]);
    } catch (err) {
      console.error("[YoutubeSabrExtractor handle error]", err);
      return this.createResponse(null, []);
    }
  }

  async stream(track: any) {
    try {
      if (!this.innertube)
        throw new Error("Innertube not initialized; call activate() first");
      const videoId = extractVideoId(track.url || track.raw?.id || "");
      if (!videoId)
        throw new Error("Unable to extract video id from track.url");
      // Use the helper to create the SABR stream (returns Node.js readable)
      const nodeStream = await createSabrStream(
        videoId,
        this.cookies,
        this.logSabrEvents
      );
      return nodeStream;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

function isUrl(input: any) {
  try {
    const url = new URL(input);
    return ["https:", "http:"].includes(url.protocol);
  } catch (e) {
    return false;
  }
}

function extractVideoId(vid: any) {
  const YOUTUBE_REGEX =
    /^https:\/\/(www\.)?youtu(\.be\/.{11}(.+)?|be\.com\/watch\?v=.{11}(&.+)?)/;
  if (!YOUTUBE_REGEX.test(vid)) throw new Error("Invalid youtube url");

  let id = new URL(vid).searchParams.get("v");
  // VIDEO DETECTED AS YT SHORTS OR youtu.be link
  if (!id) id = vid.split("/").at(-1)?.split("?").at(0);

  return id;
}

function extractPlaylistId(url: any) {
  try {
    const u = new URL(url);
    return u.searchParams.get("list");
  } catch {
    return null;
  }
}

/**
 * Try to resolve a youtu.be short link to the final canonical URL.
 * Uses HEAD first, falls back to GET if needed. Returns the final URL string
 * or the original input on failure.
 *
 * Note: relies on global fetch being available (Node 18+). If fetch isn't
 * available in your environment, you can polyfill with node-fetch or use Innertube's fetch.
 */
async function resolveFinalUrl(input: any) {
  try {
    // prefer HEAD to minimize data, but some endpoints block HEAD so we fallback to GET
    if (typeof fetch !== "function") return input;

    // HEAD attempt
    try {
      const head = await fetch(input, { method: "HEAD", redirect: "follow" });
      if (head?.url) return head.url;
    } catch (headErr) {
      // ignore and try GET
    }

    const get = await fetch(input, { method: "GET", redirect: "follow" });
    return get?.url || input;
  } catch (err) {
    // anything fails -> return original
    return input;
  }
}
