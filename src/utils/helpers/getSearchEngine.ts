import { SearchQueryType } from "discord-player";
import { SoundcloudExtractor } from "discord-player-soundcloud";

export const getSearchEngine = (
  query: string
): `ext:${string}` | SearchQueryType | undefined => {
  if (query.includes("soundcloud.com")) {
    return `ext:${SoundcloudExtractor.identifier}`;
  }

  return;
};
