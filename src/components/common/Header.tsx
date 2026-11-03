import { useState } from 'react';
import {
  RotateCcw,
  Bell,
  HelpCircle,
  FileText,
  LogOut,
  Store,
  Briefcase,
  Truck,
  Building2,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { UserRole, appStore, useStore } from '../../services/store';
import { AppLanguage } from '../../types';

interface Props {
  currentRole: UserRole;
  onOpenAbout: () => void;
  onOpenHowCalculated: () => void;
  onLogout: () => void;
  is10pmActive: boolean;
  onToggle10pm: () => void;
}

export function Header({
  currentRole,
  onOpenAbout,
  onOpenHowCalculated,
  onLogout,
  is10pmActive,
  onToggle10pm,
}: Props) {
  const { state, setLanguage } = useStore();
  const currentLang = state.language;

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const roleMeta: Record<
    UserRole,
    { label: string; sub: string; icon: any; bg: string; text: string; border: string }
  > = {
    retailer: {
      label: 'Retailer',
      sub: 'Sharma General Store (Wadala)',
      icon: Store,
      bg: 'bg-blue-50 text-[#1F3FB5]',
      text: 'text-[#1F3FB5]',
      border: 'border-blue-200',
    },
    salesperson: {
      label: 'Salesperson',
      sub: 'Rahul (Covers 10 Kiranas)',
      icon: Briefcase,
      bg: 'bg-amber-50 text-amber-900',
      text: 'text-amber-800',
      border: 'border-amber-300',
    },
    distributor: {
      label: 'Distributor',
      sub: 'Mumbai East Depot (Vijay Logistics)',
      icon: Truck,
      bg: 'bg-blue-50 text-[#1F3FB5]',
      text: 'text-[#1F3FB5]',
      border: 'border-blue-200',
    },
    manufacturer: {
      label: 'HUL Planner',
      sub: 'National & Regional Supply Chain',
      icon: Building2,
      bg: 'bg-purple-50 text-purple-900',
      text: 'text-purple-800',
      border: 'border-purple-300',
    },
  };

  const currentMeta = roleMeta[currentRole];
  const Icon = currentMeta.icon;

  const handleSwitchRole = (role: UserRole) => {
    appStore.setActiveRole(role);
    setShowRoleDropdown(false);
  };

  const handleReset = () => {
    appStore.resetDemoData();
    setShowResetConfirm(false);
  };

  const languages: { code: AppLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* App Title & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1F3FB5] flex items-center justify-center text-white font-extrabold text-base shadow-xs tracking-tight">
              H
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#1A1A1A] text-sm sm:text-base tracking-tight leading-none">
                  HUL Kirana
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#1F3FB5] uppercase tracking-wider">
                  Demand-Sensing
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden md:block leading-none mt-0.5">
                Live Retail Availability & Replenishment Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center: Role Switcher Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${currentMeta.bg} ${currentMeta.border} shadow-2xs hover:shadow-xs`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <div className="text-left hidden sm:block">
              <span className="font-bold">{currentMeta.label}:</span>{' '}
              <span className="text-[11px] opacity-80">{currentMeta.sub}</span>
            </div>
            <div className="text-left sm:hidden font-bold">
              {currentMeta.label}
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
          </button>

          {/* Role Dropdown */}
          {showRoleDropdown && (
            <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Switch Viewing Role
              </div>
              {(Object.keys(roleMeta) as UserRole[]).map((rKey) => {
                const r = roleMeta[rKey];
                const RIcon = r.icon;
                const isSelected = rKey === currentRole;
                return (
                  <button
                    key={rKey}
                    onClick={() => handleSwitchRole(rKey)}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-blue-50/70 font-semibold text-[#1F3FB5]' : 'text-slate-700'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${r.bg} ${r.border} border`}>
                      <RIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold leading-tight">{r.label}</div>
                      <div className="text-[10px] text-slate-500 truncate leading-tight">{r.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Tools: Language Switcher, 10 PM Reminder, Formulas, About, Reset, Logout */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Dropdown / Buttons */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`min-h-[32px] px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  currentLang === l.code
                    ? 'bg-[#1F3FB5] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Simulate 10 PM Reminder Button */}
          <button
            onClick={onToggle10pm}
            title="Simulate 10 PM Nightly Closing Sales Reminder"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              is10pmActive
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-300'
                : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-800 border-slate-200'
            }`}
          >
            <Bell className={`w-3.5 h-3.5 ${is10pmActive ? 'animate-bounce' : ''}`} />
            <span className="hidden lg:inline text-[11px]">10 PM Reminder</span>
          </button>

          {/* Formulas Button */}
          <button
            onClick={onOpenHowCalculated}
            title="Statistical Logic & Calculation Formulas"
            className="p-1.5 rounded-lg text-slate-600 hover:text-[#1F3FB5] hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* About / DPDP Notice */}
          <button
            onClick={onOpenAbout}
            title="Case Study Context & Privacy Notes"
            className="flex items-center gap-1 p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-slate-600 hover:text-[#1F3FB5] hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 text-xs font-medium"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden xl:inline text-[11px]">About</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset to Initial 60-Day Seed Data"
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Log Out to Login Screen"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-[#1A1A1A] text-base mb-1">Reset Demo Data?</h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              This will restore all 12 Kiranas, 60 days of historical demand, initial stock-outs, and delivery records to original seed state.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
