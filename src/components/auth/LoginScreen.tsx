import { Store, Briefcase, Truck, Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserRole, useStore } from '../../services/store';
import { AppLanguage } from '../../types';
import { t } from '../../i18n/translations';

interface Props {
  onLoginAs: (role: UserRole) => void;
  onOpenAbout: () => void;
}

export function LoginScreen({ onLoginAs, onOpenAbout }: Props) {
  const { state, setLanguage } = useStore();
  const currentLang = state.language;

  const languages: { code: AppLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' },
  ];

  const roles = [
    {
      id: 'retailer' as UserRole,
      title: currentLang === 'hi' ? 'किराना दुकानदार' : currentLang === 'mr' ? 'किराणा दुकानदार' : 'Kirana Retailer',
      name: 'Sharma General Store',
      subtitle: 'Ramesh Sharma · Wadala East',
      tierBadge: currentLang === 'hi' ? 'बोलकर, फोटो से या स्कैनर से बिक्री दर्ज करें' : currentLang === 'mr' ? 'बोलून, फोटो काढून किंवा स्कॅनरने नोंदवा' : 'Voice, Photo, Type or Billing Machine',
      description:
        currentLang === 'hi'
          ? 'रोज की बिक्री और बचा हुआ स्टॉक आसानी से दर्ज करें। रीफिल सुझाव देखें और सीधे ऑर्डर दें या सेल्समैन को बुलाएँ।'
          : currentLang === 'mr'
          ? 'रोजची विक्री आणि शिल्लक साठा सहज नोंदवा. पुनर्भरणा सूचना पहा आणि थेट ऑर्डर द्या किंवा सेल्समनला बोलवा.'
          : 'Records daily sales & closing stock with their preferred method. Gets automated refill suggestions, orders directly or calls sales rep.',
      icon: Store,
      accentBorder: 'border-blue-300 hover:border-[#1F3FB5]',
      buttonBg: 'bg-[#1F3FB5] hover:bg-[#162e87] text-white',
    },
    {
      id: 'salesperson' as UserRole,
      title: currentLang === 'hi' ? 'एचयूएल सेल्समैन' : currentLang === 'mr' ? 'एचयूएल सेल्समन' : 'Field Sales Officer',
      name: 'Rahul (Field Officer)',
      subtitle: 'Territory: 10 Kirana Stores, Mumbai East',
      tierBadge: currentLang === 'hi' ? 'दुकान विज़िट रूट प्लान' : currentLang === 'mr' ? 'दुकान भेट नियोजन' : 'Prioritized Store Route Plan',
      description:
        currentLang === 'hi'
          ? 'प्राथमिकता के आधार पर दुकानों का विज़िट प्लान। दुकानदारों के अनुरोध स्वीकारें और फिजिकल स्टॉक चेक करें।'
          : currentLang === 'mr'
          ? 'प्राधान्यक्रमानुसार दुकानांचे भेट नियोजन. दुकानदारांच्या विनंत्या स्वीकारा आणि साठा तपासा.'
          : 'Visits kirana stores guided by urgency and retailer requests. Verifies physical shelf counts and places assisted orders.',
      icon: Briefcase,
      accentBorder: 'border-slate-300 hover:border-[#1F3FB5]',
      buttonBg: 'bg-[#1F3FB5] hover:bg-[#162e87] text-white',
    },
    {
      id: 'distributor' as UserRole,
      title: currentLang === 'hi' ? 'डिपो डिस्ट्रीब्यूटर' : currentLang === 'mr' ? 'डेपो वितरक' : 'Redistribution Stockist',
      name: 'Vijay Logistics · Mumbai East',
      subtitle: 'Kurla East Depot · 12 Kiranas',
      tierBadge: currentLang === 'hi' ? 'ऑर्डर डिलीवरी और वैन क्षमता' : currentLang === 'mr' ? 'ऑर्डर डिलिव्हरी आणि वाहन क्षमता' : 'Zone Fulfilment & Replenishment',
      description:
        currentLang === 'hi'
          ? 'पूरे इलाके की डिमांड और स्टॉक देखें, वैन स्लॉट संभालें और दुकानों में स्टॉक खत्म होने से पहले रीफिल भेजें।'
          : currentLang === 'mr'
          ? 'संपूर्ण भागाची मागणी आणि साठा पहा, वाहन स्लॉट व्यवस्थापित करा आणि साठा संपण्यापूर्वी पुनर्भरणा पाठवा.'
          : 'Monitors aggregate zone demand, manages incoming kirana orders, van delivery slots, and 14-day replenishment forecasts.',
      icon: Truck,
      accentBorder: 'border-slate-300 hover:border-[#1F3FB5]',
      buttonBg: 'bg-[#1F3FB5] hover:bg-[#162e87] text-white',
    },
    {
      id: 'manufacturer' as UserRole,
      title: 'HUL National Planner',
      name: 'Central Supply Chain',
      subtitle: 'Hindustan Unilever Head Office, Mumbai',
      tierBadge: 'National S&OP Planning',
      description:
        'Aggregates live point-of-sale depletion across regional depots. Translates kirana shelf trends into 4-week factory production schedules.',
      icon: Building2,
      accentBorder: 'border-slate-300 hover:border-[#1F3FB5]',
      buttonBg: 'bg-[#1F3FB5] hover:bg-[#162e87] text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto w-full pt-4 pb-12">
        {/* Top Language Switcher Bar on Login Screen */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1F3FB5] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
              H
            </div>
            <span className="font-extrabold text-[#1A1A1A] text-base">HUL Kirana</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
              Language / भाषा / भाषा:
            </span>
            <div className="flex items-center bg-white rounded-lg p-1 border border-slate-300 shadow-2xs">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`min-h-[36px] px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    currentLang === l.code
                      ? 'bg-[#1F3FB5] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1F3FB5] text-xs font-bold uppercase tracking-wider">
            MBA Strategy Case Study · HUL FMCG Innovation
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">
            Kirana Demand-Sensing Platform
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Eliminating blind replenishment and stock-outs across neighbourhood kirana stores through adaptive daily capture and shared real-time demand intelligence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenAbout}
              className="text-xs font-bold text-[#1F3FB5] hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Read Case Study Problem Statement & Assumptions</span>
            </button>
          </div>
        </div>

        {/* Demo Logins Grid */}
        <div className="mb-8">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>Select a Demo Stakeholder Account</span>
            <span className="text-xs font-normal normal-case text-slate-500">
              One shared data store connects all 4 roles in real-time
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all duration-200 flex flex-col justify-between ${r.accentBorder}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-blue-50 text-[#1F3FB5] border border-blue-100">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {r.title}
                          </div>
                          <div className="text-base font-black text-[#1A1A1A] leading-tight">
                            {r.name}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {r.subtitle.split('·')[1]?.trim() || r.subtitle}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {r.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[11px] font-medium text-slate-500">
                      {r.tierBadge}
                    </span>
                    <button
                      onClick={() => onLoginAs(r.id)}
                      className={`min-h-[44px] flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-black transition-all shadow-xs hover:shadow ${r.buttonBg}`}
                    >
                      <span>Log in as {r.title.split(' ')[0]}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-3 border-t border-slate-200">
        Sample data · Academic prototype for MBA research · Not an official HUL product
      </footer>
    </div>
  );
}
