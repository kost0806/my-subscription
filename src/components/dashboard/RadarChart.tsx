"use client";

import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChannelStats } from "@/types";
import { METRICS } from "@/lib/metrics";

interface Props {
  channels: ChannelStats[];
  topN?: number;
}

export default function RadarChartSection({ channels, topN = 5 }: Props) {
  if (channels.length === 0) return null;

  // Normalize each metric 0-100 across all channels
  const maxValues = METRICS.reduce(
    (acc, m) => ({
      ...acc,
      [m.key]: Math.max(...channels.map((c) => c[m.key]), 1),
    }),
    {} as Record<string, number>
  );

  const topChannels = [...channels]
    .sort((a, b) => {
      const scoreA = METRICS.reduce((s, m) => s + a[m.key] / maxValues[m.key], 0);
      const scoreB = METRICS.reduce((s, m) => s + b[m.key] / maxValues[m.key], 0);
      return scoreB - scoreA;
    })
    .slice(0, topN);

  const colors = ["#f87171", "#a78bfa", "#34d399", "#fbbf24", "#60a5fa"];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
        <span>🕸️</span> TOP {topN} 종합 분석
      </h2>
      <p className="text-white/40 text-sm mb-6">
        각 지표를 최대값 기준으로 정규화한 레이더 차트
      </p>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <ResponsiveContainer width="100%" height={280}>
          <RechartsRadar
            data={METRICS.map((m) => ({
              metric: m.label,
              ...topChannels.reduce(
                (acc, ch) => ({
                  ...acc,
                  [ch.channelName]: Math.round(
                    (ch[m.key] / maxValues[m.key]) * 100
                  ),
                }),
                {}
              ),
            }))}
          >
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            {topChannels.map((ch, i) => (
              <Radar
                key={ch.channelId}
                name={ch.channelName}
                dataKey={ch.channelName}
                stroke={colors[i]}
                fill={colors[i]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
            <Tooltip
              contentStyle={{
                background: "rgba(15,15,26,0.9)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                color: "white",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [
                `${value}점`,
                name,
              ]}
            />
          </RechartsRadar>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="space-y-3">
          {topChannels.map((ch, i) => {
            const totalScore = Math.round(
              (METRICS.reduce((s, m) => s + ch[m.key] / maxValues[m.key], 0) /
                METRICS.length) *
                100
            );
            return (
              <div key={ch.channelId} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: colors[i] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white text-sm truncate">{ch.channelName}</p>
                    <span
                      className="text-xs font-bold shrink-0"
                      style={{ color: colors[i] }}
                    >
                      {totalScore}점
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full mt-1">
                    <div
                      className="h-1.5 rounded-full transition-all duration-1000"
                      style={{
                        width: `${totalScore}%`,
                        backgroundColor: colors[i],
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
