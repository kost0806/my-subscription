export interface ChannelStats {
  channelId: string;
  channelName: string;
  thumbnailUrl: string;
  subscribedAt: Date;
  subscribedDays: number;
  videosWatched: number;
  likedVideos: number;
  watchTimeMinutes: number;
  totalVideos?: number;
  subscriberCount?: number;
}

export type MetricKey =
  | "subscribedDays"
  | "videosWatched"
  | "likedVideos"
  | "watchTimeMinutes";

export interface MetricConfig {
  key: MetricKey;
  label: string;
  unit: string;
  icon: string;
  color: string;
  gradient: string;
  formatValue: (v: number) => string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  accessToken: string;
}

export interface WatchHistoryEntry {
  titleUrl: string;
  channelId?: string;
  channelName?: string;
  time: string;
}
