import React, { useState } from 'react';
import { ShieldCheck, Home, Car, CreditCard, Sparkles, Target, Loader2, Plane, AlertCircle, Calendar, Palette, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from './LanguageContext';

interface PersonalPageProps {
    onNavigate: (page: string) => void;
}

interface TimelineItem {
    month: string;
    title: string;
    desc: string;
}

interface Plan {
    monthlySavings: string;
    tips: string[];
    timeline: TimelineItem[];
}

export const PersonalPage: React.FC<PersonalPageProps> = ({ onNavigate }) => {
    const { t } = useLanguage();
    const [goal, setGoal] = useState('');
    const [loadingPlan, setLoadingPlan] = useState(false);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [error, setError] = useState<string | null>(null);

    const quickGoals = [
        { id: 'vacation', icon: Plane, label: t('planner.quick.vacation'), text: 'I want to save $5,000 for a trip to Italy next summer.' },
        { id: 'car', icon: Car, label: t('planner.quick.car'), text: 'I need $8,000 for a down payment on a new car in 6 months.' },
        { id: 'home', icon: Home, label: t('planner.quick.home'), text: 'I want to save $30,000 for a house down payment in 2 years.' },
        { id: 'emergency', icon: AlertCircle, label: t('planner.quick.emergency'), text: 'I want to build a $10,000 emergency fund in 12 months.' },
    ];

    const cleanJson = (text: string) => {
        let cleaned = text.trim();
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }

        return cleaned;
    };

    const generatePlan = async (goalText: string) => {
        if (!goalText.trim()) return;

        // Update local input state immediately
        setGoal(goalText);
        setLoadingPlan(true);
        setPlan(null);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
            Act as a financial advisor.
            User Goal: "${goalText}"
            
            Create a realistic savings plan.
            Output ONLY raw JSON (no markdown formatting).
            Structure:
            {
                "monthlySavings": "e.g. $400/month",
                "tips": ["Tip 1", "Tip 2", "Tip 3"],
                "timeline": [
                    {"month": "Month 1", "title": "Start", "desc": "Open high-yield savings"},
                    {"month": "Month 3", "title": "Check-in", "desc": "Assess progress"},
                    {"month": "Goal Reached", "title": "Final Goal", "desc": "Book tickets"}
                ]
            }
          `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            const cleanedText = cleanJson(response.text || '{}');
            const data = JSON.parse(cleanedText);

            if (!data.monthlySavings || !data.timeline) {
                throw new Error("Invalid plan format");
            }

            setPlan(data);
        } catch (e) {
            console.error("Failed to generate plan:", e);
            setError("We couldn't generate a plan at this moment. Please try again or refine your goal.");
        } finally {
            setLoadingPlan(false);
        }
    };

    return (
        <div className="bg-gray-50 pb-16">
            {/* Page Hero - Compact */}
            <div className="bg-lamar-blue text-white py-12 md:py-16 relative overflow-hidden">
                {/* Abstract Background Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{t('personal.title')}</h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed">
                        {t('personal.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

                    {/* Checking & Savings Card */}
                    <div id="checking" className="bg-white rounded-xl shadow-lg border-t-4 border-lamar-blue hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full scroll-mt-24">
                        <div className="p-6 md:p-8 flex-grow flex flex-col">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-lamar-blue flex-shrink-0">
                                    <CreditCard size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">{t('personal.checking.title')}</h3>
                                    <p className="text-sm font-medium text-gray-500 mt-1">Everyday Banking</p>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                                {t('personal.checking.desc')}
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-sm text-gray-700">
                                    <CheckCircle2 size={18} className="text-lamar-blue flex-shrink-0" />
                                    <span>{t('personal.checking.list1')}</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-700">
                                    <CheckCircle2 size={18} className="text-lamar-blue flex-shrink-0" />
                                    <span>{t('personal.checking.list2')}</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-700">
                                    <CheckCircle2 size={18} className="text-lamar-blue flex-shrink-0" />
                                    <span>{t('personal.checking.list3')}</span>
                                </li>
                            </ul>

                            <div className="flex flex-wrap gap-3 mt-auto">
                                <button
                                    onClick={() => onNavigate('compare-accounts')}
                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-lg shadow-sm text-white bg-lamar-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lamar-blue transition-colors whitespace-nowrap"
                                >
                                    {t('personal.checking.btn')}
                                </button>
                                <button
                                    onClick={() => onNavigate('card-design')}
                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-lamar-blue text-sm font-bold rounded-lg text-lamar-blue bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lamar-blue transition-colors gap-2 whitespace-nowrap"
                                >
                                    <Palette size={16} /> Custom Card
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Loans Card */}
                    <div id="lending" className="bg-white rounded-xl shadow-lg border-t-4 border-lamar-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full scroll-mt-24">
                        <div className="p-6 md:p-8 flex-grow flex flex-col">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-lamar-accent flex-shrink-0">
                                    <Home size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">{t('personal.lending.title')}</h3>
                                    <p className="text-sm font-medium text-gray-500 mt-1">Borrowing Power</p>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                                {t('personal.lending.desc')}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-full shadow-sm text-gray-500">
                                        <Car size={18} />
                                    </div>
                                    <span className="font-bold text-gray-900 text-sm">{t('personal.lending.auto')}</span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-full shadow-sm text-gray-500">
                                        <Home size={18} />
                                    </div>
                                    <span className="font-bold text-gray-900 text-sm">{t('personal.lending.mortgage')}</span>
                                </div>
                            </div>

                            <a
                                href="https://loans.lamarnational.com/s/login/?language=en_US&ec=302&startURL=%2Fs%2F"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-lg shadow-sm text-white bg-lamar-accent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lamar-accent transition-colors mt-auto"
                            >
                                {t('personal.lending.btn')}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Smart Savings Goal Planner */}
                <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-lamar-blue rounded-2xl shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="p-6 md:p-10 relative z-10">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 bg-white/10 text-teal-200 px-4 py-1.5 rounded-full font-bold uppercase text-xs tracking-wider mb-4 border border-white/10">
                                <Sparkles size={14} /> {t('planner.title')}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Turn Dreams into Reality</h2>
                            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                                {t('planner.subtitle')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                            {/* Input Section */}
                            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 md:p-8 flex flex-col">
                                <label className="text-sm font-semibold text-teal-100 uppercase tracking-wide mb-4 block">Quick Start</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                    {quickGoals.map((q) => (
                                        <button
                                            key={q.id}
                                            onClick={() => generatePlan(q.text)}
                                            disabled={loadingPlan}
                                            className="flex flex-col items-center justify-center p-3 bg-black/20 hover:bg-white/20 rounded-lg transition-colors border border-transparent hover:border-white/30 text-white disabled:opacity-50"
                                        >
                                            <q.icon size={20} className="mb-2 text-teal-300" />
                                            <span className="text-xs font-medium text-center">{q.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <label className="text-sm font-semibold text-teal-100 uppercase tracking-wide mb-2 block">Your Goal Details</label>
                                <textarea
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    placeholder={t('planner.placeholder')}
                                    className="w-full flex-grow bg-white/95 border-0 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 min-h-[140px] resize-none text-lg mb-6 shadow-inner"
                                />

                                <button
                                    onClick={() => generatePlan(goal)}
                                    disabled={loadingPlan || !goal}
                                    className="w-full bg-gradient-to-r from-teal-400 to-lamar-blue text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loadingPlan ? <Loader2 className="animate-spin" /> : <Target size={20} />}
                                    {loadingPlan ? t('planner.creating') : t('planner.btn.create')}
                                </button>
                            </div>

                            {/* Results Section */}
                            <div className="relative min-h-[400px]">
                                {error ? (
                                    <div className="h-full bg-white/10 backdrop-blur-md rounded-xl border border-blue-400/30 flex flex-col items-center justify-center text-center p-8 animate-fadeIn">
                                        <AlertCircle size={48} className="text-blue-300 mb-4" />
                                        <p className="text-white font-medium text-lg mb-2">Something went wrong</p>
                                        <p className="text-blue-100 text-sm max-w-xs">{error}</p>
                                        <button onClick={() => setError(null)} className="mt-6 text-xs text-white underline hover:text-teal-200">Try again</button>
                                    </div>
                                ) : plan ? (
                                    <div className="bg-white rounded-xl shadow-xl overflow-hidden h-full flex flex-col animate-slideUp">
                                        {/* Header Summary */}
                                        <div className="bg-teal-50 p-6 border-b border-teal-100">
                                            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">{t('planner.monthly')}</span>
                                            <div className="text-4xl font-extrabold text-teal-900">{plan.monthlySavings}</div>
                                        </div>

                                        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                                            {/* Timeline */}
                                            <div className="mb-8">
                                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 flex items-center gap-2">
                                                    <Calendar size={16} className="text-teal-600" /> {t('planner.timeline')}
                                                </h4>
                                                <div className="relative pl-4 space-y-8">
                                                    {/* Vertical Line */}
                                                    <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-200"></div>

                                                    {plan.timeline.map((item, i) => (
                                                        <div key={i} className="relative pl-6">
                                                            {/* Dot */}
                                                            <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-teal-500 rounded-full border-2 border-white shadow-sm z-10"></div>

                                                            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded mb-1 inline-block">{item.month}</span>
                                                            <h5 className="font-bold text-gray-900 text-sm">{item.title}</h5>
                                                            <p className="text-sm text-gray-600 leading-snug">{item.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Tips */}
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                                    <Sparkles size={16} className="text-purple-600" /> {t('planner.tips')}
                                                </h4>
                                                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                                    <ul className="space-y-2">
                                                        {plan.tips.map((tip, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                                <div className="mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                                                                {tip}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                                            <p className="text-[10px] text-gray-400">{t('planner.disclaimer')}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full border-2 border-dashed border-white/20 rounded-xl bg-white/5 flex flex-col items-center justify-center text-center p-8 text-blue-100/50">
                                        <Target size={64} className="mb-4 opacity-50" strokeWidth={1} />
                                        <p className="text-lg font-medium text-white/70">Your personalized plan will appear here</p>
                                        <p className="text-sm mt-2 max-w-xs">Start by selecting a quick goal or describing your own dream above.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Digital Banking Feature */}
                <div id="mobile" className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-center gap-8 scroll-mt-24">
                    <div className="flex-1">
                        <div className="inline-block bg-blue-100 text-lamar-blue px-3 py-1 rounded-full text-xs font-bold uppercase mb-4">{t('personal.mobile.badge')}</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('personal.mobile.title')}</h2>
                        <p className="text-gray-600 mb-6">
                            {t('personal.mobile.desc')}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="https://apps.apple.com/us/app/lamar-national-bank-mobile/id1089053965" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
                                {t('app.store')}
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=com.lamarnational.mobile" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
                                {t('google.play')}
                            </a>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <ShieldCheck size={120} className="text-gray-200" strokeWidth={1} />
                    </div>
                </div>
            </div>
        </div>
    );
};
