import { ChannelStats } from "@/types";
import { differenceInDays } from "date-fns";

const YT_API = "https://www.googleapis.com/youtube/v3";

interface YTSubscriptionItem {
  snippet: {
    publishedAt: string;
    resourceId: { channelId: string };
    title: string;
    thumbnails: { default?: { url: string }; medium?: { url: string } };
  };
}

interface YTChannelItem {
  id: string;
  statistics?: {
    subscriberCount?: string;
    videoCount?: string;
  };
}

interface YTPlaylistItem {
  snippet: {
    publishedAt: string;
    channelId: string;
    resourceId?: { videoId: string };
    videoOwnerChannelId?: string;
  };
}

async function fetchAll<T>(
  url: string,
  accessToken: string,
  params: Record<string, string>
): Promise<T[]> {
  const items: T[] = [];
  let pageToken: string | undefined;

  do {
    const query = new URLSearchParams({
      ...params,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });

    const res = await fetch(`${YT_API}/${url}?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
    const data = await res.json();
    items.push(...(data.items || []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return items;
}

export async function fetchSubscriptions(
  accessToken: string,
  apiKey: string
): Promise<ChannelStats[]> {
  // 1. Fetch all subscriptions
  const subs = await fetchAll<YTSubscriptionItem>(
    "subscriptions",
    accessToken,
    { part: "snippet", mine: "true", key: apiKey }
  );

  if (subs.length === 0) return [];

  // 2. Fetch channel stats in batches of 50
  const channelIds = subs.map((s) => s.snippet.resourceId.channelId);
  const channelStatsMap: Record<string, YTChannelItem> = {};

  for (let i = 0; i < channelIds.length; i += 50) {
    const batch = channelIds.slice(i, i + 50);
    const res = await fetch(
      `${YT_API}/channels?part=statistics&id=${batch.join(",")}&key=${apiKey}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (res.ok) {
      const data = await res.json();
      (data.items || []).forEach((ch: YTChannelItem) => {
        channelStatsMap[ch.id] = ch;
      });
    }
  }

  // 3. Fetch liked videos playlist ID
  const meRes = await fetch(
    `${YT_API}/channels?part=contentDetails&mine=true&key=${apiKey}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  let likedByChannel: Record<string, number> = {};

  if (meRes.ok) {
    const meData = await meRes.json();
    const likesPlaylistId =
      meData.items?.[0]?.contentDetails?.relatedPlaylists?.likes;

    if (likesPlaylistId) {
      const likedItems = await fetchAll<YTPlaylistItem>(
        "playlistItems",
        accessToken,
        { part: "snippet", playlistId: likesPlaylistId, key: apiKey }
      );
      likedItems.forEach((item) => {
        const chId = item.snippet.videoOwnerChannelId;
        if (chId) {
          likedByChannel[chId] = (likedByChannel[chId] || 0) + 1;
        }
      });
    }
  }

  // 4. Build ChannelStats array
  return subs.map((sub) => {
    const channelId = sub.snippet.resourceId.channelId;
    const subscribedAt = new Date(sub.snippet.publishedAt);
    const chStats = channelStatsMap[channelId];

    return {
      channelId,
      channelName: sub.snippet.title,
      thumbnailUrl:
        sub.snippet.thumbnails.medium?.url ||
        sub.snippet.thumbnails.default?.url ||
        "",
      subscribedAt,
      subscribedDays: differenceInDays(new Date(), subscribedAt),
      videosWatched: 0,
      likedVideos: likedByChannel[channelId] || 0,
      watchTimeMinutes: 0,
      totalVideos: chStats?.statistics?.videoCount
        ? parseInt(chStats.statistics.videoCount)
        : undefined,
      subscriberCount: chStats?.statistics?.subscriberCount
        ? parseInt(chStats.statistics.subscriberCount)
        : undefined,
    };
  });
}

export function parseWatchHistory(
  jsonData: unknown[]
): Record<string, { watched: number; watchTimeMinutes: number }> {
  const result: Record<string, { watched: number; watchTimeMinutes: number }> =
    {};

  for (const entry of jsonData) {
    const item = entry as {
      subtitles?: Array<{ url?: string; name?: string }>;
      titleUrl?: string;
      time?: string;
    };
    const channelUrl = item.subtitles?.[0]?.url;
    if (!channelUrl) continue;

    const match = channelUrl.match(/channel\/(UC[^?&]+)/);
    const channelId = match?.[1];
    if (!channelId) continue;

    if (!result[channelId]) {
      result[channelId] = { watched: 0, watchTimeMinutes: 0 };
    }
    result[channelId].watched += 1;
    result[channelId].watchTimeMinutes += 8; // avg ~8 min per video
  }

  return result;
}
