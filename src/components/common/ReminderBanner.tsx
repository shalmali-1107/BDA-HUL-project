import { Bell, Flame, X, MessageSquare } from 'lucide-react';
import { Retailer } from '../../types';

interface Props {
  retailer?: Retailer;
  onDismiss: () => void;
  onActionClick?: () => void;
}

export function ReminderBanner({ retailer, onDismiss, onActionClick }: Props) {
  const storeName = retailer ? retailer.name : 'Sharma General Store';
  const streak = retailer ? retailer.loggingStreakDays : 14;

  return (
    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2.5 shadow-md border-b border-amber-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 bg-amber-800/60 rounded-lg shrink-0">
            <Bell className="w-4 h-4 animate-bounce text-amber-200" />
          </div>
          <div className="text-xs">
            <span className="font-bold">10:00 PM Daily Kirana Reminder: </span>
            <span className="opacity-95">
              Shops closing! Please record today’s sales & closing stock for {storeName}.
            </span>
            <span className="hidden md:inline ml-2 text-amber-100/80 italic text-[11px]">
              (Simulated in-app; real deployment uses WhatsApp / SMS).
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-amber-800/80 px-2.5 py-1 rounded-full text-xs font-semibold text-amber-100 border border-amber-500/40">
            <Flame className="w-3.5 h-3.5 text-orange-300 fill-orange-300" />
            <span>{streak}-Day Streak</span>
          </div>

          {onActionClick && (
            <button
              onClick={onActionClick}
              className="bg-white text-amber-900 hover:bg-amber-50 font-bold px-3 py-1 rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3 text-amber-700" />
              Log Now
            </button>
          )}

          <button
            onClick={onDismiss}
            className="text-amber-200 hover:text-white p-1 rounded transition-colors"
            title="Dismiss reminder"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
