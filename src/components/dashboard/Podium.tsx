"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChannelStats, MetricConfig } from "@/types";
import CountUp from "@/components/ui/CountUp";

interface PodiumProps {
  channels: ChannelStats[];
  metric: MetricConfig;
}

const RANKS = [
  { position: 2, height: "h-28", zIndex: "z-10", label: "2위", medal: "🥈", bgColor: "bg-gray-400/20", borderColor: "border-gray-400/40", delay: 0.3 },
  { position: 1, height: "h-44", zIndex: "z-20", label: "1위", medal: "🥇", bgColor: "bg-yellow-400/20", borderColor: "border-yellow-400/50", delay: 0.1 },
  { position: 3, height: "h-20", zIndex: "z-10", label: "3위", medal: "🥉", bgColor: "bg-orange-400/20", borderColor: "border-orange-400/40", delay: 0.5 },
];

const ORDER = [1, 0, 2]; // Display: 2nd, 1st, 3rd

export default function Podium({ channels, metric }: PodiumProps) {
  const top3 = [...channels]
    .sort((a, b) => b[metric.key] - a[metric.key])
    .slice(0, 3);

  if (top3.length === 0) return null;

  return (
    <div className="flex items-end justify-center gap-3 pt-8 pb-4">
      {ORDER.map((rankIdx) => {
        const rank = RANKS[rankIdx];
        const channel = top3[rankIdx];
        if (!channel) return <div key={rankIdx} className="w-28" />;

        const value = channel[metric.key];

        return (
          <motion.div
            key={channel.channelId}
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: rank.delay,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="flex flex-col items-center gap-2"
          >
            {/* Channel info above podium */}
            <div className="flex flex-col items-center gap-1 mb-2">
              <span className="text-lg">{rank.medal}</span>
              <div className="relative">
                {channel.thumbnailUrl ? (
                  <Image
                    src={channel.thumbnailUrl}
                    alt={channel.channelName}
                    width={rankIdx === 0 ? 56 : 48}
                    height={rankIdx === 0 ? 56 : 48}
                    className={`rounded-full border-2 ${rank.borderColor} object-cover ${rankIdx === 0 ? "w-14 h-14" : "w-12 h-12"}`}
                    unoptimized
                  />
                ) : (
                  <div
                    className={`rounded-full border-2 ${rank.borderColor} ${rank.bgColor} flex items-center justify-center ${rankIdx === 0 ? "w-14 h-14" : "w-12 h-12"}`}
                  >
                    <span className="text-xl">
                      {channel.channelName.charAt(0)}
                    </span>
                  </div>
                )}
                {rankIdx === 0 && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border border-dark-900"
                  />
                )}
              </div>
              <p
                className={`font-semibold text-center leading-tight max-w-[100px] text-xs ${rankIdx === 0 ? "text-white text-sm" : "text-white/80"}`}
              >
                {channel.channelName}
              </p>
              <p
                className={`font-bold text-sm bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}
              >
                <CountUp end={value} formatter={metric.formatValue} duration={1000} />
              </p>
            </div>

            {/* Podium block */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: rank.delay + 0.2, origin: "bottom" }}
              style={{ transformOrigin: "bottom" }}
              className={`w-24 ${rank.height} ${rank.bgColor} border ${rank.borderColor} rounded-t-xl flex items-center justify-center backdrop-blur-sm relative overflow-hidden`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-t ${metric.gradient} opacity-10`}
              />
              <span className="text-2xl font-black text-white/30 relative z-10">
                {rankIdx + 1}
              </span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
