"use server";

const API_DISABLED_ERROR = "API is temporarily disabled";

// Telegram Actions

// TODO: Restore API-backed Telegram link code generation once the API is healthy again.
export async function generateTelegramCode(): Promise<{ code: string }> {
  throw new Error(API_DISABLED_ERROR);
}

// TODO: Restore API-backed Telegram channel toggling once the API is healthy again.
export async function toggleTelegramChannel(
  _chatId: string,
  _enabled: boolean,
): Promise<{ success: true; enabled: boolean }> {
  throw new Error(API_DISABLED_ERROR);
}

// Discord Actions

// TODO: Restore API-backed Discord channel creation once the API is healthy again.
export async function addDiscordChannel(data: {
  guildId: string;
  guildName: string;
  channelId: string;
  channelName: string;
}): Promise<{ success: true }> {
  void data;
  throw new Error(API_DISABLED_ERROR);
}

// TODO: Restore API-backed Discord channel removal once the API is healthy again.
export async function removeDiscordChannel(
  _channelId: string,
): Promise<{ success: true }> {
  throw new Error(API_DISABLED_ERROR);
}

// TODO: Restore API-backed Discord channel toggling once the API is healthy again.
export async function toggleDiscordChannel(
  _channelId: string,
  _enabled: boolean,
): Promise<{ success: true; enabled: boolean }> {
  throw new Error(API_DISABLED_ERROR);
}
