"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const FEATURES = [
  {
    icon: "📅",
    title: "구독 기간",
    desc: "언제부터 구독했는지 한눈에",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: "▶️",
    title: "시청한 영상",
    desc: "채널별 시청 영상 수 비교",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    icon: "👍",
    title: "좋아한 영상",
    desc: "채널별 좋아요 누른 영상 수",
    gradient: "from-red-400 to-rose-500",
  },
  {
    icon: "⏱️",
    title: "시청 시간",
    desc: "얼마나 많은 시간을 봤는지",
    gradient: "from-amber-400 to-orange-500",
  },
];

export default function LandingPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      console.error("Sign in failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-2xl mx-auto relative z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm px-4 py-1.5 rounded-full mb-6"
        >
          <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
          YouTube 구독 분석 대시보드
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl sm:text-6xl font-black text-white leading-tight mb-4"
        >
          내 구독 채널
          <br />
          <span className="bg-gradient-to-r from-brand-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">
            얼마나 봤을까?
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/60 text-lg mb-10 leading-relaxed"
        >
          구독 중인 채널들의 통계를 한눈에 확인하고,
          <br className="hidden sm:block" />
          어떤 채널을 제일 많이 봤는지 포디움에서 확인해보세요!
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSignIn}
          className="group relative inline-flex items-center gap-3 bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded-2xl shadow-2xl shadow-white/20 hover:shadow-white/30 transition-shadow"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google로 시작하기
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-400/0 via-brand-400/0 to-brand-400/0 group-hover:from-transparent group-hover:via-white/5 group-hover:to-transparent transition-all" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/30 text-xs mt-4"
        >
          YouTube 구독 정보 읽기 권한만 요청합니다
        </motion.p>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-16 max-w-3xl w-full relative z-10"
      >
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/8 transition-colors"
          >
            <div className="text-3xl mb-2">{f.icon}</div>
            <p
              className={`font-bold text-sm bg-gradient-to-r ${f.gradient} bg-clip-text text-transparent`}
            >
              {f.title}
            </p>
            <p className="text-white/40 text-xs mt-1">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Podium preview hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-10 text-center relative z-10"
      >
        <p className="text-white/30 text-sm flex items-center gap-2 justify-center">
          <span>🏆</span>
          각 지표별 TOP 3 채널을 포디움에서 확인
          <span>🏆</span>
        </p>
      </motion.div>
    </main>
  );
}
