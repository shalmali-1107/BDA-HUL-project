import { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Clock,
  Send,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  BookOpen,
} from 'lucide-react';
import { AppLanguage, HelpRequest, Retailer } from '../../types';
import { t } from '../../i18n/translations';
import { useStore, appStore } from '../../services/store';

// Customer Service Configuration Constants
export const HELPLINE_CONFIG = {
  phoneNumber: '1800-XXX-XXXX',
  telUrl: 'tel:1800XXXXXXX',
  whatsappUrl: 'https://wa.me/911800XXXXXX?text=Hi%2C%20I%20need%20help%20with%20my%20Kirana%20store',
  workingHoursEn: 'Monday to Saturday, 9:00 AM – 7:00 PM',
  workingHoursHi: 'सोमवार से शनिवार, सुबह 9:00 बजे से शाम 7:00 बजे तक',
  workingHoursMr: 'सोमवार ते शनिवार, सकाळी ९:०० ते संध्याकाळी ७:००',
};

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  language?: AppLanguage;
  role?: string;
  userRole?: string;
  userName?: string;
  userPhone?: string;
  salesmanName?: string;
  salesmanPhone?: string;
  retailer?: Retailer;
  helpRequests?: HelpRequest[];
  onOpenGuide?: () => void;
  onCallSalesman?: () => void;
}

export function HelpPanel({
  isOpen = true,
  onClose,
  language,
  role,
  userRole,
  userName = 'Ramesh Sharma',
  userPhone,
  salesmanName,
  salesmanPhone,
  retailer,
  helpRequests,
  onOpenGuide,
  onCallSalesman,
}: Props) {
  const { state } = useStore();
  const effectiveLang = language || state.language;
  const effectiveRole = role || userRole || 'retailer';
  const effectiveRequests = helpRequests || state.helpRequests || [];

  if (isOpen === false) return null;

  const [activeTab, setActiveTab] = useState<'contact' | 'callback' | 'my_requests' | 'faqs'>('contact');

  // Callback form
  const [problemType, setProblemType] = useState('Delivery / Order Delay');
  const [preferredTime, setPreferredTime] = useState('Today 4:00 PM – 5:00 PM');
  const [phone, setPhone] = useState(userPhone || (retailer ? retailer.phone : '+91 98202 11001'));
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Role-specific FAQs
  const getFaqs = () => {
    if (effectiveRole === 'retailer') {
      return [
        {
          q: effectiveLang === 'mr' ? 'आजची विक्री कशी नोंदवायची?' : effectiveLang === 'hi' ? 'आज की बिक्री कैसे जोड़ें?' : 'How do I add today’s sales?',
          a: effectiveLang === 'mr' ? 'होम स्क्रीनवरील "आजची विक्री नोंदवा" बटनावर दाबा. तुम्ही बोलून सांगू शकता, वहीचा फोटो काढू शकता किंवा टाइप करू शकता.' : effectiveLang === 'hi' ? 'होम स्क्रीन पर "आज की बिक्री दर्ज करें" बटन दबाएं। आप बोलकर बता सकते हैं, बहीखाते का फोटो खींच सकते हैं या टाइप कर सकते हैं।' : 'Tap "Add today’s sales" on the Home screen. You can speak, take a photo of your notebook, or type numbers.',
        },
        {
          q: effectiveLang === 'mr' ? 'ऑर्डर केलेल्या मालाची डिलिव्हरी कधी होईल?' : effectiveLang === 'hi' ? 'ऑर्डर किया गया सामान कब मिलेगा?' : 'When will my order arrive?',
          a: effectiveLang === 'mr' ? 'ऑर्डर देताना तुम्ही निवडलेल्या डिलिव्हरी वेळेनुसार माल येईल. "ऑर्डर स्थिती" टॅबमध्ये गाडीचा ट्रॅक पहा.' : effectiveLang === 'hi' ? 'ऑर्डर करते समय चुने गए स्लॉट के अनुसार गाड़ी आएगी। "ऑर्डर स्थिति" में लाइव स्थिति देखें।' : 'Orders are delivered in the slot you chose (e.g. Tomorrow morning). Check "Track Orders" for live delivery status.',
        },
        {
          q: effectiveLang === 'mr' ? 'चुकीची विक्री नोंदवली गेली तर बदलू शकतो का?' : effectiveLang === 'hi' ? 'गलत बिक्री दर्ज हो जाए तो क्या करें?' : 'What if I made a mistake in today’s sales?',
          a: effectiveLang === 'mr' ? 'सेव्ह केल्यानंतर लगेच स्क्रीनवर "Undo" चे बटन दिसते. किंवा पुन्हा एकदा विक्री नोंदवून बरोबर आकडे भरा.' : effectiveLang === 'hi' ? 'सेव करने के तुरंत बाद "Undo" का विकल्प मिलता है। आप दोबारा सही संख्या दर्ज करके भी सेव कर सकते हैं।' : 'You can tap "Undo" right after saving, or submit the correct figures to overwrite.',
        },
        {
          q: effectiveLang === 'mr' ? 'डिलिव्हरी उशीर झाल्यास ₹१५० डिस्काउंट कसा मिळतो?' : effectiveLang === 'hi' ? 'डिलीवरी लेट होने पर ₹150 की छूट कैसे मिलती है?' : 'How does the ₹150 delivery delay credit work?',
          a: effectiveLang === 'mr' ? 'जर डेपोकडून ठरलेल्या वेळेत गाडी आली नाही, तर पुढच्या बिलावर ₹१५० ची सूट आपोआप जमा होते.' : effectiveLang === 'hi' ? 'यदि डिपो तय समय पर डिलीवरी नहीं कर पाता, तो अगले बिल पर ₹150 का डिस्काउंट क्रेडिट अपने आप जुड़ जाता है।' : 'If the distributor misses your promised slot, ₹150 goodwill credit is credited automatically to your next invoice.',
        },
      ];
    } else if (effectiveRole === 'salesperson') {
      return [
        {
          q: effectiveLang === 'mr' ? 'दुकान भेटींची क्रमवारी कशी ठरते?' : effectiveLang === 'hi' ? 'दुकानों की प्राथमिकता कैसे तय होती है?' : 'How is the visit priority list calculated?',
          a: effectiveLang === 'mr' ? '४०% तात्काळ गरज (साठा संपणे), २५% दुकानदाराची विनंती, २०% संभाव्य नुकसान आणि १५% मागील भेट न झालेला काळ.' : effectiveLang === 'hi' ? '40% तात्कालिकता, 25% दुकानदार का अनुरोध, 20% संभावित नुकसान और 15% पिछले दौरे की अवधि।' : '40% urgency (days of cover), 25% retailer request, 20% at-risk sales value, 15% staleness.',
        },
        {
          q: effectiveLang === 'mr' ? 'फिजिकल साठा मोजणी (Triangulation) कशी करावी?' : effectiveLang === 'hi' ? 'स्टॉक काउंट कैसे दर्ज करें?' : 'How do I perform physical stock count?',
          a: effectiveLang === 'mr' ? 'दुकान उघडून "प्रत्यक्ष साठा तपासा" दाबा. शेल्फवरील मोजलेली संख्या टाका आणि सेव्ह करा.' : effectiveLang === 'hi' ? 'दुकान खोलकर "स्टॉक जाँचें" पर जाएँ। शेल्फ पर गिने हुए पीस डालकर सेव करें।' : 'Tap "Check physical stock" on the retailer detail screen, enter shelf counts, and save.',
        },
      ];
    } else {
      return [
        {
          q: effectiveLang === 'mr' ? 'व्हॅन क्षमता कशी नियंत्रित करावी?' : effectiveLang === 'hi' ? 'वैन क्षमता कैसे मैनेज करें?' : 'How is van capacity monitored?',
          a: effectiveLang === 'mr' ? 'प्रत्येक स्लॉटसाठी जास्तीत जास्त ८० पेट्यांची मर्यादा आहे. ८५% पेक्षा जास्त भरल्यास नवीन ऑर्डर पुढील स्लॉटसाठी सुचवली जाते.' : effectiveLang === 'hi' ? 'प्रत्येक स्लॉट की अधिकतम क्षमता 80 केस है। 85% से अधिक भरने पर अगली डिलीवरी की सिफारिश होती है।' : 'Each delivery slot is capped at 80 cases per van to prevent delivery delays.',
        },
        {
          q: effectiveLang === 'mr' ? 'फॅक्टरी ऑर्डर शिफारस कशी तयार होते?' : effectiveLang === 'hi' ? 'फैक्ट्री ऑर्डर सिफारिश कैसे बनती है?' : 'How is depot factory purchase order computed?',
          a: effectiveLang === 'mr' ? '१२ दुकानांची पुढील ७ दिवसांची अपेक्षित विक्री आणि डेपोमधील शिल्लक साठा वजा करून आपोआप पेट्या मोजल्या जातात.' : effectiveLang === 'hi' ? '12 दुकानों की 7 दिनों की अपेक्षित बिक्री को डेपो स्टॉक से घटाकर आवश्यक पेटियां निकाली जाती हैं।' : 'Aggregated 7-day store demand across all zone retailers minus current depot stock.',
        },
      ];
    }
  };

  const faqs = getFaqs();

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.addHelpRequest({
      role: effectiveRole,
      userName,
      phone,
      problemType,
      preferredTime,
      note,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveTab('my_requests');
    }, 2000);
  };

  const workingHours =
    effectiveLang === 'mr'
      ? HELPLINE_CONFIG.workingHoursMr
      : effectiveLang === 'hi'
      ? HELPLINE_CONFIG.workingHoursHi
      : HELPLINE_CONFIG.workingHoursEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1F3FB5] text-white rounded-xl shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#1A1A1A] text-base sm:text-lg leading-tight">
                {t('helplineTitle', effectiveLang)}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{workingHours}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-center">
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'contact' ? 'bg-white text-[#1F3FB5] shadow-2xs' : 'text-slate-600'
            }`}
          >
            {t('help', effectiveLang)}
          </button>
          <button
            onClick={() => setActiveTab('callback')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'callback' ? 'bg-white text-[#1F3FB5] shadow-2xs' : 'text-slate-600'
            }`}
          >
            Call back
          </button>
          <button
            onClick={() => setActiveTab('my_requests')}
            className={`py-2 rounded-lg transition-all relative ${
              activeTab === 'my_requests' ? 'bg-white text-[#1F3FB5] shadow-2xs' : 'text-slate-600'
            }`}
          >
            {t('myRequests', effectiveLang).split(' ')[0]}
            {effectiveRequests.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-blue-700 text-white rounded-full text-[10px]">
                {effectiveRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'faqs' ? 'bg-white text-[#1F3FB5] shadow-2xs' : 'text-slate-600'
            }`}
          >
            FAQ
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* TAB 1: DIRECT CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-3.5">
              {/* Toll Free Helpline Card */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-[#1F3FB5] uppercase tracking-wider block">
                  {t('helplineCallNow', effectiveLang)}
                </span>
                <div className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-wider">
                  {HELPLINE_CONFIG.phoneNumber}
                </div>
                <p className="text-[11px] text-slate-600">
                  {workingHours}
                </p>
                <a
                  href={HELPLINE_CONFIG.telUrl}
                  className="inline-flex items-center justify-center gap-2 w-full min-h-[48px] py-2.5 px-4 bg-[#1F3FB5] hover:bg-[#183296] text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{t('helplineCallNow', effectiveLang)}</span>
                </a>
              </div>

              {/* WhatsApp Support Card */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    {t('whatsappChat', effectiveLang)}
                  </span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                    Fast reply
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  {t('whatsappHelp', effectiveLang)}
                </p>
                <a
                  href={HELPLINE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full min-h-[48px] py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('whatsappChat', effectiveLang)}</span>
                </a>
              </div>

              {/* For Retailer: Call My Salesman */}
              {effectiveRole === 'retailer' && onCallSalesman && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-200 text-amber-900 rounded-lg">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[#1A1A1A]">{t('callSalesman', effectiveLang)}</div>
                      <div className="text-[11px] text-slate-500">Rahul · +91 98200 45678</div>
                    </div>
                  </div>
                  <button
                    onClick={onCallSalesman}
                    className="px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold text-xs"
                  >
                    Call
                  </button>
                </div>
              )}

              {/* First-time Guide Link */}
              <button
                onClick={onOpenGuide}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#1F3FB5]" />
                  <span className="font-bold text-[#1A1A1A]">
                    {effectiveLang === 'mr' ? '३ पायऱ्यांचे सोपे ॲप मार्गदर्शक पहा' : effectiveLang === 'hi' ? '3 चरणों की आसान ऍप गाइड देखें' : 'View 3-Step Simple App Guide'}
                  </span>
                </div>
                <span className="text-xs text-[#1F3FB5] font-bold">Open →</span>
              </button>
            </div>
          )}

          {/* TAB 2: REQUEST CALL BACK */}
          {activeTab === 'callback' && (
            <div className="space-y-3">
              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="font-bold text-sm text-emerald-950">
                    Call Back Request Registered!
                  </div>
                  <p className="text-xs text-emerald-800">
                    Our team will call you on <strong>{phone}</strong> at <strong>{preferredTime}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t('problemType', effectiveLang)}
                    </label>
                    <select
                      value={problemType}
                      onChange={(e) => setProblemType(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                    >
                      <option>Delivery / Order Delay</option>
                      <option>Damaged Goods / Return Issue</option>
                      <option>Invoice or Billing Discrepancy</option>
                      <option>Festive Scheme & Margin Query</option>
                      <option>App Login or Voice Recording Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Phone Number to Call:
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t('preferredTime', effectiveLang)}:
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                    >
                      <option>Within 30 minutes</option>
                      <option>Today 12:00 PM – 2:00 PM</option>
                      <option>Today 4:00 PM – 5:00 PM</option>
                      <option>Tomorrow Morning 10:00 AM – 12:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t('noteOptional', effectiveLang)}:
                    </label>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Need clarification on yesterday's bill..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[48px] py-2.5 px-4 bg-[#1F3FB5] hover:bg-[#183296] text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('submitCallback', effectiveLang)}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: MY REQUESTS */}
          {activeTab === 'my_requests' && (
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-700">
                {t('myRequests', effectiveLang)}
              </div>
              {effectiveRequests.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  {t('noRequestsYet', effectiveLang)}
                </div>
              ) : (
                effectiveRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1A1A]">{req.problemType}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          req.status === 'Closed'
                            ? 'bg-slate-100 text-slate-700 border-slate-300'
                            : req.status === 'In progress'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Time slot: <strong>{req.preferredTime}</strong> · Phone: {req.phone}
                    </div>
                    {req.note && (
                      <div className="text-[11px] text-slate-700 italic">"{req.note}"</div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: QUICK FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-700">
                {t('quickQuestionsTitle', effectiveLang)}
              </div>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1"
                >
                  <div className="font-bold text-[#1A1A1A]">{faq.q}</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
