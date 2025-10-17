import {
  InteractionReplyOptions,
  MessageFlags,
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  SeparatorBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
} from "discord.js";
import { embedColors, Color } from "../constants/constants";

export const buildEmbedMessage = ({
  title,
  titleFontSize = "sm",
  color,
  ephemeral = false,
  description,
  imageUrl,
  thumbnail,
  footerText,
}: {
  title: string;
  titleFontSize?: "lg" | "md" | "sm";
  color?: Color;
  ephemeral?: boolean;
  description?: string;
  imageUrl?: string;
  thumbnail?: string;
  footerText?: string;
}): InteractionReplyOptions => {
  const getFontSize = () => {
    switch (titleFontSize) {
      case "lg":
        return "#";
      case "md":
        return "##";
      case "sm":
        return "###";
    }
  };

  const container = new ContainerBuilder();

  const headerSection = new SectionBuilder();

  const textDisplay = new TextDisplayBuilder().setContent(
    `${getFontSize()} ${title}\n${description ?? ""}`
  );

  if (thumbnail) {
    const thumb = new ThumbnailBuilder().setURL(thumbnail);
    headerSection.setThumbnailAccessory(thumb);

    headerSection.addTextDisplayComponents(textDisplay);
    container.addSectionComponents(headerSection);
  } else {
    container.addTextDisplayComponents(textDisplay);
  }

  if (imageUrl) {
    const galleryItem = new MediaGalleryItemBuilder().setURL(imageUrl);
    const gallery = new MediaGalleryBuilder().addItems(galleryItem);
    container.addMediaGalleryComponents(gallery);
  }

  if (footerText) {
    container.addSeparatorComponents(new SeparatorBuilder());
    const footerDisplay = new TextDisplayBuilder().setContent(footerText);
    container.addTextDisplayComponents(footerDisplay);
  }

  if (color) {
    container.setAccentColor(embedColors[color]);
  }

  const getFlags = () => {
    if (ephemeral) {
      return [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2];
    }
    return [MessageFlags.IsComponentsV2];
  };

  return {
    flags: getFlags(),
    components: [container],
  } as InteractionReplyOptions;
};
