"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function Header({ onRefresh, isRefreshing }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-dark-950/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/30">
            <span className="text-white text-sm font-black">S</span>
          </div>
          <span className="font-bold text-white text-lg tracking-tight hidden sm:block">
            SubStats
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? "animate-spin" : ""}
              />
              <span className="hidden sm:block">
                {isRefreshing ? "불러오는 중..." : "새로고침"}
              </span>
            </button>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border border-white/20"
                    unoptimized
                  />
                )}
                <span className="text-white/70 text-sm hidden sm:block">
                  {user.displayName}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/80 transition-colors"
                title="로그아웃"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
