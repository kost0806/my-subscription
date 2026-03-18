export default function DashboardLoading() {
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
