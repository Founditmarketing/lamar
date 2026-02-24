import React, { useState } from 'react';
import { Calculator, ShieldCheck, BookOpen, ArrowLeft, Sparkles, Loader2, DollarSign, Percent, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from './LanguageContext';

type Tool = 'none' | 'mortgage';

interface ResourcesPageProps {
    onNavigate?: (page: string) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onNavigate }) => {
    const { t } = useLanguage();
    const [activeTool, setActiveTool] = useState<Tool>('none');

    // Calculator State
    const [loanAmount, setLoanAmount] = useState<string>('300000');
    const [interestRate, setInterestRate] = useState<string>('6.5');
    const [loanTerm, setLoanTerm] = useState<string>('30');
    const [downPayment, setDownPayment] = useState<string>('60000');
    const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

    // AI Insight State
    const [aiLoading, setAiLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState<string | null>(null);

    const calculateMortgage = () => {
        const principal = parseFloat(loanAmount) - parseFloat(downPayment);
        const calculatedInterest = parseFloat(interestRate) / 100 / 12;
        const calculatedPayments = parseFloat(loanTerm) * 12;

        if (principal > 0 && calculatedInterest > 0 && calculatedPayments > 0) {
            const x = Math.pow(1 + calculatedInterest, calculatedPayments);
            const monthly = (principal * x * calculatedInterest) / (x - 1);
            setMonthlyPayment(monthly);
            setAiInsight(null); // Reset AI insight on new calculation
        }
    };

    const getAiInsight = async () => {
        if (!monthlyPayment) return;
        setAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
            Act as a financial advisor.
            Scenario:
            - Home Price: $${loanAmount}
            - Down Payment: $${downPayment}
            - Interest Rate: ${interestRate}%
            - Term: ${loanTerm} years
            - Estimated Monthly P&I: $${monthlyPayment.toFixed(2)}

            Provide 2 brief, helpful insights or tips regarding this mortgage scenario. 
            Focus on affordability or long-term interest. 
            Keep it under 50 words.
          `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt
            });

            setAiInsight(response.text || '');
        } catch (e) {
            console.error(e);
            setAiInsight("Consider speaking with a loan officer to lock in today's best rates.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleNav = (page: string) => {
        if (onNavigate) onNavigate(page);
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            {/* Hero */}
            <div className="bg-lamar-navy text-white py-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl font-bold mb-4">{t('resources.hero.title')}</h1>
                    <p className="text-xl text-blue-200 max-w-2xl">
                        {t('resources.hero.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">

                {activeTool === 'none' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Calculator Card */}
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-8 border-t-4 border-lamar-blue">
                            <div className="w-14 h-14 bg-blue-50 text-lamar-blue rounded-xl flex items-center justify-center mb-6">
                                <Calculator size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('resources.calc.title')}</h3>
                            <p className="text-gray-600 mb-6">{t('resources.calc.desc')}</p>
                            <button
                                onClick={() => setActiveTool('mortgage')}
                                className="w-full py-3 border border-lamar-blue text-lamar-blue font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {t('res.btn.mortgage')} <ArrowRight size={18} />
                            </button>
                        </div>

                        {/* Security Card */}
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-8 border-t-4 border-blue-500">
                            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('resources.sec.title')}</h3>
                            <p className="text-gray-600 mb-6">{t('resources.sec.desc')}</p>
                            <button
                                onClick={() => handleNav('security')}
                                className="w-full py-3 border border-blue-500 text-blue-500 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {t('res.btn.security')} <ArrowRight size={18} />
                            </button>
                        </div>

                        {/* Education Card */}
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-8 border-t-4 border-teal-500">
                            <div className="w-14 h-14 bg-teal-50 text-teal-500 rounded-xl flex items-center justify-center mb-6">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('resources.edu.title')}</h3>
                            <p className="text-gray-600 mb-6">{t('resources.edu.desc')}</p>
                            <button
                                onClick={() => handleNav('education')}
                                className="w-full py-3 border border-teal-500 text-teal-500 font-bold rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {t('resources.edu.btn')} <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    // Active Tool View (Mortgage Calculator)
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden animate-fade-up">
                        <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center gap-4">
                            <button
                                onClick={() => setActiveTool('none')}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h2 className="text-lg font-bold text-gray-900">{t('calc.mortgage.title')}</h2>
                        </div>

                        <div className="flex flex-col lg:flex-row">
                            {/* Controls */}
                            <div className="p-6 lg:p-10 w-full lg:w-1/2 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('calc.label.amount')}</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="number"
                                            value={loanAmount}
                                            onChange={(e) => setLoanAmount(e.target.value)}
                                            className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamar-blue focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('calc.label.down')}</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="number"
                                            value={downPayment}
                                            onChange={(e) => setDownPayment(e.target.value)}
                                            className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamar-blue focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('calc.label.rate')}</label>
                                        <div className="relative">
                                            <Percent size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                            <input
                                                type="number"
                                                value={interestRate}
                                                onChange={(e) => setInterestRate(e.target.value)}
                                                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamar-blue focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('calc.label.term')}</label>
                                        <div className="relative">
                                            <Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                            <select
                                                value={loanTerm}
                                                onChange={(e) => setLoanTerm(e.target.value)}
                                                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamar-blue focus:border-transparent appearance-none bg-white"
                                            >
                                                <option value="30">30 {t('res.calc.years')}</option>
                                                <option value="20">20 {t('res.calc.years')}</option>
                                                <option value="15">15 {t('res.calc.years')}</option>
                                                <option value="10">10 {t('res.calc.years')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={calculateMortgage}
                                    className="w-full bg-lamar-blue text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-all shadow-md mt-4"
                                >
                                    {t('calc.btn.calculate')}
                                </button>
                            </div>

                            {/* Results */}
                            <div className="w-full lg:w-1/2 bg-blue-50 p-6 lg:p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-200">
                                {monthlyPayment ? (
                                    <div className="text-center animate-fadeIn">
                                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('calc.result.monthly')}</span>
                                        <div className="text-5xl md:text-6xl font-extrabold text-lamar-navy my-4">
                                            ${monthlyPayment.toFixed(2)}
                                        </div>
                                        <p className="text-sm text-gray-500 mb-8">{t('res.calc.note')}</p>

                                        {/* Action Buttons */}
                                        <div className="space-y-4 max-w-sm mx-auto">
                                            {/* Link to Loan Portal */}
                                            <a
                                                href="https://loans.lamarnational.com/s/login/?language=en_US&ec=302&startURL=%2Fs%2F"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-lamar-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                Start Mortgage Application <ExternalLink size={18} />
                                            </a>

                                            {/* AI Insights Button */}
                                            {!aiInsight && (
                                                <button
                                                    onClick={getAiInsight}
                                                    disabled={aiLoading}
                                                    className="w-full bg-white border border-blue-200 text-lamar-blue font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                                                    {aiLoading ? t('calc.ai.loading') : t('calc.btn.ai')}
                                                </button>
                                            )}
                                        </div>

                                        {aiInsight && (
                                            <div className="mt-8 bg-white p-6 rounded-xl border border-blue-100 text-left animate-slideUp relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-lamar-blue to-purple-500"></div>
                                                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                                                    <Sparkles size={16} className="text-purple-500" /> {t('calc.ai.title')}
                                                </h4>
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {aiInsight}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400 py-12">
                                        <Calculator size={64} className="mx-auto mb-4 opacity-20" />
                                        <p className="text-lg">Enter your details to see your payment estimate.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
