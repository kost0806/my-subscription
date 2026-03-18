"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChannelStats, WatchHistoryEntry } from "@/types";
import { parseWatchHistory } from "@/lib/youtube";

interface ImportModalProps {
  channels: ChannelStats[];
  onUpdate: (updated: ChannelStats[]) => void;
  onClose: () => void;
}

export default function ImportModal({ channels, onUpdate, onClose }: ImportModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [importedCount, setImportedCount] = useState(0);

  const processFile = useCallback(
    async (file: File) => {
      setStatus("processing");
      try {
        const text = await file.text();
        const json: WatchHistoryEntry[] = JSON.parse(text);
        const watchData = parseWatchHistory(json as unknown[]);

        const updated = channels.map((ch) => {
          const data = watchData[ch.channelId];
          if (!data) return ch;
          return {
            ...ch,
            videosWatched: data.watched,
            watchTimeMinutes: data.watchTimeMinutes,
          };
        });

        const count = Object.keys(watchData).length;
        setImportedCount(count);
        setStatus("done");
        onUpdate(updated);
      } catch {
        setStatus("error");
      }
    },
    [channels, onUpdate]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-dark-900 border border-white/20 rounded-3xl p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-white mb-2">
            시청 기록 가져오기
          </h3>
          <p className="text-white/50 text-sm mb-6">
            Google Takeout에서 내보낸{" "}
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">
              watch-history.json
            </code>{" "}
            파일을 불러오면 시청 영상 수와 시청 시간을 볼 수 있어요.
          </p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
              dragOver
                ? "border-brand-400 bg-brand-400/10"
                : "border-white/20 hover:border-white/40"
            }`}
          >
            {status === "idle" && (
              <>
                <div className="text-4xl mb-3">📂</div>
                <p className="text-white/60 text-sm mb-4">
                  파일을 여기에 드래그하거나
                </p>
                <label className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm px-4 py-2 rounded-xl transition-colors">
                  파일 선택
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </>
            )}

            {status === "processing" && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-white/60 text-sm">처리 중...</p>
              </div>
            )}

            {status === "done" && (
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">✅</div>
                <p className="text-white font-semibold">가져오기 완료!</p>
                <p className="text-white/50 text-sm">
                  {importedCount}개 채널의 시청 데이터를 불러왔어요.
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">❌</div>
                <p className="text-white/80 text-sm">
                  파일을 읽을 수 없어요. watch-history.json인지 확인해주세요.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white/60 text-xs leading-relaxed">
              💡{" "}
              <a
                href="https://takeout.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 hover:underline"
              >
                Google Takeout
              </a>
              에서 YouTube 데이터를 내보내면{" "}
              <code className="text-white/80">Takeout/YouTube and YouTube Music/history/watch-history.json</code>{" "}
              파일을 찾을 수 있어요.
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/70 text-sm transition-colors"
          >
            닫기
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
