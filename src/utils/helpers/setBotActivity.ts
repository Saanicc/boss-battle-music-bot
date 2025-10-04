import { ActivityType, Client } from "discord.js";

export const setBotActivity = async (
  client: Client,
  statusText: string,
  statusType?: ActivityType
) => {
  client.user?.setActivity(statusText, {
    type: statusType ? statusType : undefined,
  });
};
