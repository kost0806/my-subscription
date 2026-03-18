"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ChannelStats } from "@/types";
import { METRICS } from "@/lib/metrics";
import { fetchSubscriptions } from "@/lib/youtube";
import { SAMPLE_CHANNELS } from "@/lib/sampleData";
import Header from "@/components/layout/Header";
import StatCard from "@/components/ui/StatCard";
import MetricPodiumSection from "@/components/dashboard/MetricPodiumSection";
import ChannelTable from "@/components/dashboard/ChannelTable";
import RadarChartSection from "@/components/dashboard/RadarChart";
import ImportModal from "@/components/dashboard/ImportModal";
import { Upload } from "lucide-react";

type LoadState = "idle" | "loading" | "demo" | "real" | "error";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [channels, setChannels] = useState<ChannelStats[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [showImport, setShowImport] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(
    async (forceRefresh = false) => {
      if (!user) return;
      if (isRefreshing && !forceRefresh) return;

      if (forceRefresh) setIsRefreshing(true);
      else setLoadState("loading");

      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "";

      if (user.accessToken && apiKey) {
        try {
          const data = await fetchSubscriptions(user.accessToken, apiKey);
          setChannels(data);
          setLoadState("real");
        } catch (err) {
          console.error("YouTube API error:", err);
          setChannels(SAMPLE_CHANNELS);
          setLoadState("demo");
        }
      } else {
        // No API key or token — use demo data
        setChannels(SAMPLE_CHANNELS);
        setLoadState("demo");
      }

      setIsRefreshing(false);
    },
    [user, isRefreshing]
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && loadState === "idle") {
      loadData();
    }
  }, [user, loadState, loadData]);

  if (authLoading || loadState === "loading" || loadState === "idle") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            📊
          </div>
        </div>
        <p className="text-white/50 text-sm animate-pulse">
          구독 데이터 불러오는 중...
        </p>
      </div>
    );
  }

  // Totals
  const totals = {
    subscribedDays: Math.round(
      channels.reduce((s, c) => s + c.subscribedDays, 0) / (channels.length || 1)
    ),
    videosWatched: channels.reduce((s, c) => s + c.videosWatched, 0),
    likedVideos: channels.reduce((s, c) => s + c.likedVideos, 0),
    watchTimeMinutes: channels.reduce((s, c) => s + c.watchTimeMinutes, 0),
  };

  return (
    <>
      <Header
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Demo banner */}
        {loadState === "demo" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-3 flex items-center gap-3 text-sm"
          >
            <span className="text-xl">💡</span>
            <div>
              <span className="text-amber-300 font-semibold">데모 데이터 표시 중</span>
              <span className="text-amber-200/60 ml-2">
                YouTube API 키와 Google 로그인을 설정하면 실제 구독 데이터를 볼 수 있어요.
              </span>
            </div>
          </motion.div>
        )}

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl font-black text-white">
              {user?.displayName
                ? `${user.displayName}의 구독 통계`
                : "내 구독 통계"}
            </h1>
            <p className="text-white/40 text-sm mt-1">
              총 {channels.length}개 채널 구독 중
            </p>
          </div>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm transition-colors"
          >
            <Upload size={15} />
            시청 기록 가져오기
          </button>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map((metric, i) => (
            <StatCard
              key={metric.key}
              icon={metric.icon}
              label={metric.label}
              value={totals[metric.key]}
              formatter={metric.formatValue}
              gradient={metric.gradient}
              delay={i * 0.1}
              subtitle={
                metric.key === "subscribedDays"
                  ? "평균 구독 기간"
                  : `전체 ${metric.label} 합계`
              }
            />
          ))}
        </div>

        {/* Podium section */}
        <MetricPodiumSection channels={channels} metrics={METRICS} />

        {/* Radar chart */}
        <RadarChartSection channels={channels} topN={5} />

        {/* Channel table */}
        <ChannelTable channels={channels} />
      </main>

      {/* Import modal */}
      {showImport && (
        <ImportModal
          channels={channels}
          onUpdate={setChannels}
          onClose={() => setShowImport(false)}
        />
      )}
    </>
  );
}
