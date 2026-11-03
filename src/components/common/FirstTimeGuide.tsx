import { useState } from 'react';
import { X, Mic, Package, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { AppLanguage } from '../../types';
import { t } from '../../i18n/translations';

import { useStore } from '../../services/store';

interface Props {
  isOpen?: boolean;
  onClose: () => void;
  language?: AppLanguage;
}

export function FirstTimeGuide({ isOpen = true, onClose, language }: Props) {
  const { state } = useStore();
  const effectiveLang = language || state.language;
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: t('guideStep1Title', effectiveLang),
      desc: t('guideStep1Desc', effectiveLang),
      icon: Mic,
      bgColor: 'bg-blue-100 text-[#1F3FB5]',
    },
    {
      step: 2,
      title: t('guideStep2Title', effectiveLang),
      desc: t('guideStep2Desc', effectiveLang),
      icon: Package,
      bgColor: 'bg-amber-100 text-amber-800',
    },
    {
      step: 3,
      title: t('guideStep3Title', effectiveLang),
      desc: t('guideStep3Desc', effectiveLang),
      icon: ShoppingBag,
      bgColor: 'bg-emerald-100 text-emerald-800',
    },
  ];

  const current = steps[currentStep - 1];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider">
            {t('stepOf', effectiveLang)} {currentStep} of 3
          </span>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Icon Card */}
        <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center ${current.bgColor} shadow-inner`}>
          <Icon className="w-10 h-10" />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-[#1A1A1A] leading-tight">
            {current.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {current.desc}
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 pt-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === currentStep ? 'w-6 bg-[#1F3FB5]' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          className="w-full min-h-[48px] py-3 bg-[#1F3FB5] hover:bg-[#183296] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          {currentStep === 3 ? (
            <>
              <Check className="w-4 h-4" />
              <span>{t('guideStart', effectiveLang)}</span>
            </>
          ) : (
            <>
              <span>{effectiveLang === 'mr' ? 'पुढील पायरी' : effectiveLang === 'hi' ? 'अगला कदम' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
