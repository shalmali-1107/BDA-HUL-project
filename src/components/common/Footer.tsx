export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/90 backdrop-blur-xs py-3 px-4 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Sample data
          </span>
          <span>
            MBA Case Study prototype for Hindustan Unilever (HUL) Kirana Demand-Sensing Network. All figures & stores are synthetic.
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          HUL Kirana Platform · v2.0 (English · हिन्दी · मराठी)
        </div>
      </div>
    </footer>
  );
}
