"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChannelStats, MetricConfig } from "@/types";
import Podium from "./Podium";

interface MetricPodiumSectionProps {
  channels: ChannelStats[];
  metrics: MetricConfig[];
}

export default function MetricPodiumSection({
  channels,
  metrics,
}: MetricPodiumSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeMetric = metrics[activeIdx];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span>🏆</span> 지표별 TOP 3 채널
      </h2>

      {/* Metric selector tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {metrics.map((metric, idx) => (
          <button
            key={metric.key}
            onClick={() => setActiveIdx(idx)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeIdx === idx
                ? `bg-gradient-to-r ${metric.gradient} text-white shadow-lg shadow-black/20`
                : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
            }`}
          >
            {metric.icon} {metric.label}
          </button>
        ))}
      </div>

      {/* Podium */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMetric.key}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Podium channels={channels} metric={activeMetric} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
