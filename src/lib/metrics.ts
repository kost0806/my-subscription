import { MetricConfig } from "@/types";

export const METRICS: MetricConfig[] = [
  {
    key: "subscribedDays",
    label: "구독 기간",
    unit: "일",
    icon: "📅",
    color: "#a78bfa",
    gradient: "from-violet-500 to-purple-600",
    formatValue: (v) => `${v.toLocaleString()}일`,
  },
  {
    key: "videosWatched",
    label: "시청한 영상",
    unit: "개",
    icon: "▶️",
    color: "#34d399",
    gradient: "from-emerald-400 to-teal-500",
    formatValue: (v) => `${v.toLocaleString()}개`,
  },
  {
    key: "likedVideos",
    label: "좋아한 영상",
    unit: "개",
    icon: "👍",
    color: "#f87171",
    gradient: "from-red-400 to-rose-500",
    formatValue: (v) => `${v.toLocaleString()}개`,
  },
  {
    key: "watchTimeMinutes",
    label: "시청 시간",
    unit: "분",
    icon: "⏱️",
    color: "#fbbf24",
    gradient: "from-amber-400 to-orange-500",
    formatValue: (v) => {
      const hours = Math.floor(v / 60);
      const mins = v % 60;
      if (hours === 0) return `${mins}분`;
      if (mins === 0) return `${hours.toLocaleString()}시간`;
      return `${hours.toLocaleString()}시간 ${mins}분`;
    },
  },
];
