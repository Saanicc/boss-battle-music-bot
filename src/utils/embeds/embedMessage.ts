import { InteractionReplyOptions } from "discord.js";
import { EMBED_COLORS } from "../constants/constants";
import { Color } from "../constants/constants.types";

export const buildEmbedMessage = ({
  title,
  color,
  ephemeral,
  description,
}: {
  title: string;
  color?: Color;
  ephemeral?: boolean;
  description?: string;
}) => {
  const data = {
    embeds: [
      {
        title,
        description: description && description,
        color: color && EMBED_COLORS[color],
      },
    ],
    flags: ephemeral && "Ephemeral",
  } as InteractionReplyOptions;

  return data;
};
