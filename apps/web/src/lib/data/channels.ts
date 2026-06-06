export interface DiscordChannel {
  channelId: string;
  channelName: string;
  guildId: string;
  guildName: string;
  enabled: boolean;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  botPresent: boolean;
}

export interface GuildChannel {
  id: string;
  name: string;
  parentId: string | null;
}

// TODO: Restore API-backed Telegram status once the API is healthy again.
export async function getTelegramStatus() {
  "use cache: private";
  return { linked: false };
}

// TODO: Restore API-backed Discord status once the API is healthy again.
export async function getDiscordStatus() {
  "use cache: private";
  return { connected: false, channels: [] as DiscordChannel[] };
}

// TODO: Restore API-backed Discord guilds once the API is healthy again.
export async function getDiscordGuilds() {
  "use cache: private";
  return { guilds: [] as DiscordGuild[] };
}

// TODO: Restore API-backed Discord guild channels once the API is healthy again.
export async function getDiscordGuildChannels(_guildId: string) {
  "use cache";
  return { channels: [] as GuildChannel[] };
}
