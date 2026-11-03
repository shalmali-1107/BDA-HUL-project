import { VisitRequest } from '../../types';
import { Calendar, Clock, Check, RefreshCw, MessageSquare, AlertCircle } from 'lucide-react';

interface Props {
  requests: VisitRequest[];
  onAccept: (requestId: string) => void;
  onReschedule: (requestId: string) => void;
}

export function SalespersonVisitInbox({ requests, onAccept, onReschedule }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-extrabold text-base text-[#14202B]">
            Retailer-Requested Store Visits Inbox
          </h3>
          <p className="text-xs text-[#4B5A67]">
            Direct visit requests sent by kirana shopkeepers through their app.
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          {requests.filter((r) => r.status === 'PENDING').length} Actionable
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {requests.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No incoming retailer visit requests.
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="py-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#14202B]">
                      {req.retailerName}
                    </span>
                    <span className="text-xs text-slate-500">({req.area})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        req.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : req.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0B6B5F]" />
                    <span>Requested: <strong>{req.requestedDate}</strong></span>
                    <span>·</span>
                    <Clock className="w-3.5 h-3.5 text-[#0B6B5F]" />
                    <span>Slot: <strong>{req.requestedTimeSlot}</strong></span>
                  </div>
                </div>

                {req.status === 'PENDING' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onAccept(req.id)}
                      className="px-3 py-1.5 bg-[#0B6B5F] hover:bg-[#09574d] text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => onReschedule(req.id)}
                      className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reschedule</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Reason note */}
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#0B6B5F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Shopkeeper's Note:</strong> {req.reason}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
