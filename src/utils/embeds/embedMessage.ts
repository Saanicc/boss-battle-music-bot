import { InteractionReplyOptions } from "discord.js";
import { EMBED_COLORS } from "../constants/constants";
import { Color } from "../constants/constants.types";

export const buildEmbedMessage = ({
  title,
  color,
  ephemeral,
  description,
  imageUrl,
}: {
  title: string;
  color?: Color;
  ephemeral?: boolean;
  description?: string;
  imageUrl?: string;
}) => {
  return {
    embeds: [
      {
        title,
        description: description && description,
        color: color && EMBED_COLORS[color],
        ...(imageUrl && {
          image: {
            url: imageUrl,
          },
        }),
      },
    ],
    flags: ephemeral ? "Ephemeral" : undefined,
  } as InteractionReplyOptions;
};
