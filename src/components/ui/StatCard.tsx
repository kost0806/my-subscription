"use client";

import { motion } from "framer-motion";
import CountUp from "./CountUp";

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  formatter: (v: number) => string;
  gradient: string;
  delay?: number;
  subtitle?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  formatter,
  gradient,
  delay = 0,
  subtitle,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-4 sm:p-6 hover:bg-white/8 transition-colors group"
    >
      {/* Gradient accent */}
      <div
        className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${gradient} opacity-80`}
      />

      {/* Glow effect */}
      <div
        className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{icon}</span>
          <span className="text-xs text-white/40 bg-white/5 rounded-full px-3 py-1 border border-white/10">
            {label}
          </span>
        </div>

        <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          <CountUp end={value} formatter={formatter} duration={1200} />
        </div>

        {subtitle && (
          <p className="text-white/40 text-xs mt-2">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
