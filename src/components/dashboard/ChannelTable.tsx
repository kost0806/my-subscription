"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChannelStats, MetricKey } from "@/types";
import { METRICS } from "@/lib/metrics";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface ChannelTableProps {
  channels: ChannelStats[];
}

const SORT_OPTIONS: { key: MetricKey | "channelName"; label: string }[] = [
  { key: "channelName", label: "이름" },
  { key: "subscribedDays", label: "구독 기간" },
  { key: "videosWatched", label: "시청 영상" },
  { key: "likedVideos", label: "좋아요" },
  { key: "watchTimeMinutes", label: "시청 시간" },
];

export default function ChannelTable({ channels }: ChannelTableProps) {
  const [sortKey, setSortKey] = useState<MetricKey | "channelName">(
    "subscribedDays"
  );
  const [sortDesc, setSortDesc] = useState(true);
  const [search, setSearch] = useState("");

  const sorted = [...channels]
    .filter((c) =>
      c.channelName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === "channelName") {
        return sortDesc
          ? b.channelName.localeCompare(a.channelName)
          : a.channelName.localeCompare(b.channelName);
      }
      return sortDesc ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey];
    });

  const toggleSort = (key: typeof sortKey) => {
    if (key === sortKey) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📋</span> 전체 구독 채널
          <span className="text-sm font-normal text-white/50">
            ({channels.length}개)
          </span>
        </h2>
        <input
          type="text"
          placeholder="채널 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40 transition-colors w-full sm:w-48"
        />
      </div>

      {/* Sort buttons */}
      <div className="flex gap-2 flex-wrap mb-4">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => toggleSort(opt.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              sortKey === opt.key
                ? "bg-white/20 text-white"
                : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            {opt.label}
            {sortKey === opt.key && (
              <span className="ml-1">{sortDesc ? "↓" : "↑"}</span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
        {sorted.map((channel, idx) => (
          <motion.div
            key={channel.channelId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            {/* Top row: rank + avatar + name */}
            <div className="flex items-center gap-3 sm:contents">
              <span className="text-white/30 text-sm w-6 text-right shrink-0">
                {idx + 1}
              </span>

              {/* Avatar */}
              {channel.thumbnailUrl ? (
                <Image
                  src={channel.thumbnailUrl}
                  alt={channel.channelName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                  unoptimized
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white/60 font-bold">
                  {channel.channelName.charAt(0)}
                </div>
              )}

              {/* Channel name + date */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate group-hover:text-white transition-colors">
                  {channel.channelName}
                </p>
                <p className="text-xs text-white/40">
                  {format(channel.subscribedAt, "yyyy년 M월 d일 구독", {
                    locale: ko,
                  })}
                </p>
              </div>
            </div>

            {/* Metrics: 2-col on mobile, 4-col on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 sm:shrink-0 pl-9 sm:pl-0">
              {METRICS.map((metric) => (
                <div
                  key={metric.key}
                  className={`text-center transition-opacity ${
                    sortKey === metric.key ? "opacity-100" : "opacity-50 group-hover:opacity-80"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}
                  >
                    {metric.formatValue(channel[metric.key])}
                  </p>
                  <p className="text-xs text-white/30">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {sorted.length === 0 && (
          <div className="text-center text-white/40 py-12">
            검색 결과가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
