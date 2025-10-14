import { InteractionReplyOptions } from "discord.js";
import { embedColors, Color } from "../constants/constants";

export const buildEmbedMessage = ({
  title,
  color,
  ephemeral,
  description,
  imageUrl,
  thumbnail,
  footerText,
}: {
  title: string;
  color?: Color;
  ephemeral?: boolean;
  description?: string;
  imageUrl?: string;
  thumbnail?: string;
  footerText?: string;
}) => {
  return {
    embeds: [
      {
        title,
        description: description && description,
        color: color && embedColors[color],
        ...(imageUrl && {
          image: {
            url: imageUrl,
          },
        }),
        ...(thumbnail && {
          thumbnail: {
            url: thumbnail,
          },
        }),
        ...(footerText && {
          footer: {
            text: footerText,
          },
        }),
      },
    ],
    flags: ephemeral ? "Ephemeral" : undefined,
  } as InteractionReplyOptions;
};
