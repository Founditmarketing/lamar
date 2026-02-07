import React, { useState } from 'react';
import { Check, Minus, HelpCircle, Sparkles, Loader2, MessageSquare, ChevronRight, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from './LanguageContext';

export const CompareAccountsPage: React.FC = () => {
  const { t } = useLanguage();
  const [userQuery, setUserQuery] = useState('');
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Helper to render check or minus
  const renderBoolean = (val: boolean) => {
    return val ? (
        <div className="flex justify-center text-lamar-blue"><Check size={20} /></div>
    ) : (
        <div className="flex justify-center text-gray-300"><Minus size={20} /></div>
    );
  };
  
  const renderInterest = (hasInterest: boolean, note?: string) => {
      if (!hasInterest) return <div className="flex justify-center text-gray-300"><Minus size={20} /></div>;
      return (
          <div className="flex flex-col items-center">
              <div className="text-green-500"><Check size={24} strokeWidth={3} /></div>
              {note && <span className="text-xs text-green-600 font-medium">{note}</span>}
          </div>
      );
  };

  const analyzeNeeds = async () => {
    if (!userQuery.trim()) return;
    setIsAnalyzing(true);
    setRecommendation(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            Act as a banking advisor for Lamar National Bank.
            We have 3 accounts:
            1. Free Checking: $0 monthly fee, $0 minimum balance. Good for basics.
            2. Interest Checking: $10 monthly fee (waivable with $1500 balance), earns interest. Good for moderate balances.
            3. Premier Checking: $25 monthly fee (waivable with $10,000 balance), higher interest, ATM fee refunds. Good for high balances.

            User says: "${userQuery}"

            Recommend the ONE best account for this user.
            Format: "Recommended: [Account Name]. [Brief Reason]."
            Keep it under 30 words.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        
        setRecommendation(response.text);
    } catch (e) {
        console.error(e);
        setRecommendation("Sorry, I couldn't analyze your request right now. Based on general popularity, Free Checking is a great start.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-gray-50 pb-16">
      {/* Page Hero */}
      <div className="bg-lamar-blue text-white py-8 md:py-16 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">{t('compare.title')}</h1>
          <p className="text-base md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {t('compare.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-8 space-y-6 md:space-y-8">
        
        {/* AI Advisor Section */}
        <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-lamar-blue"></div>
            <div className="p-5 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                <div className="flex-1 space-y-3 w-full">
                    <div className="flex items-center gap-2 text-purple-700 font-bold uppercase text-xs tracking-wider">
                        <Sparkles size={16} /> {t('compare.advisor.label')}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">{t('compare.ai.title')}</h2>
                    <p className="text-sm md:text-base text-gray-600">
                        {t('compare.ai.subtitle')}
                    </p>
                    
                    <div className="relative mt-2">
                        <textarea
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            placeholder={t('compare.ai.placeholder')}
                            className="w-full border border-gray-300 rounded-lg p-3 md:p-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none h-20 md:h-24 text-sm md:text-base transition-all"
                        />
                        <button
                            onClick={analyzeNeeds}
                            disabled={isAnalyzing || !userQuery}
                            className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-purple-600 text-white px-3 py-1.5 md:px-4 md:py-1.5 rounded-md text-xs md:text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
                            {isAnalyzing ? t('compare.ai.analyzing') : t('compare.ai.analyze')}
                        </button>
                    </div>
                </div>

                {recommendation && (
                    <div className="w-full md:w-1/3 bg-purple-50 rounded-xl p-5 md:p-6 border border-purple-100 animate-fadeIn self-stretch flex flex-col justify-center">
                        <h3 className="font-bold text-purple-900 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                             <Sparkles size={16} className="text-purple-600" /> {t('compare.ai.result')}
                        </h3>
                        <p className="text-gray-800 text-base md:text-lg font-medium leading-relaxed">
                            {recommendation}
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* Responsive Comparison Table with Sticky Columns */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 relative">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[750px] md:min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {/* Sticky First Column */}
                  <th className="sticky left-0 z-20 bg-gray-50 p-4 md:p-6 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider w-[140px] md:w-1/4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-gray-200">
                    {t('compare.features')}
                  </th>
                  
                  <th className="p-4 md:p-6 text-center w-1/4 border-l border-gray-100 min-w-[160px]">
                    <div className="text-base md:text-xl font-bold text-gray-900">{t('compare.acct.free')}</div>
                    <div className="text-xs md:text-sm text-gray-500 mt-1">{t('compare.desc.free')}</div>
                    <div className="md:hidden mt-2 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">{t('compare.badge.pop')}</div>
                  </th>
                  
                  <th className="p-4 md:p-6 text-center w-1/4 border-l border-gray-100 bg-blue-50/30 min-w-[160px]">
                    <div className="text-base md:text-xl font-bold text-lamar-blue">{t('compare.acct.interest')}</div>
                    <div className="text-xs md:text-sm text-gray-500 mt-1">{t('compare.desc.int')}</div>
                  </th>
                  
                  <th className="p-4 md:p-6 text-center w-1/4 border-l border-gray-100 min-w-[160px]">
                    <div className="text-base md:text-xl font-bold text-gray-900">{t('compare.acct.premier')}</div>
                    <div className="text-xs md:text-sm text-gray-500 mt-1">{t('compare.desc.prem')}</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Monthly Fee */}
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50 p-4 md:p-6 text-sm font-medium text-gray-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-gray-200 transition-colors">
                      {t('compare.row.fee')}
                  </td>
                  <td className="p-4 md:p-6 text-center text-base md:text-lg font-bold text-green-600 border-l border-gray-100">$0</td>
                  <td className="p-4 md:p-6 text-center border-l border-gray-100 bg-blue-50/30">
                    <span className="font-bold text-gray-900 text-sm md:text-base">$10</span>
                    <span className="block text-[10px] md:text-xs text-gray-500">{t('compare.val.waivable')}</span>
                  </td>
                  <td className="p-4 md:p-6 text-center border-l border-gray-100">
                    <span className="font-bold text-gray-900 text-sm md:text-base">$25</span>
                    <span className="block text-[10px] md:text-xs text-gray-500">{t('compare.val.waivable')}</span>
                  </td>
                </tr>

                {/* Minimum Balance */}
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50 p-4 md:p-6 text-sm font-medium text-gray-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-gray-200 transition-colors">
                      {t('compare.row.min')}
                  </td>
                  <td className="p-4 md:p-6 text-center text-sm md:text-base text-gray-600 border-l border-gray-100">$0</td>
                  <td className="p-4 md:p-6 text-center text-sm md:text-base text-gray-600 border-l border-gray-100 bg-blue-50/30">$1,500</td>
                  <td className="p-4 md:p-6 text-center text-sm md:text-base text-gray-600 border-l border-gray-100">$10,000</td>
                </tr>

                {/* Interest Earned */}
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50 p-4 md:p-6 text-sm font-medium text-gray-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-gray-200 transition-colors">
                      {t('compare.row.interest')}
                  </td>
                  <td className="p-4 md:p-6 text-center border-l border-gray-100">
                    {renderInterest(false)}
                  </td>
                  <td className="p-4 md:p-6 text-center border-l border-gray-100 bg-blue-50/30">
                     {renderInterest(true)}
                  </td>
                  <td className="p-4 md:p-6 text-center border-l border-gray-100">
                     {renderInterest(true, t('compare.val.high'))}
                  </td>
                </tr>

                {/* ATM Fees */}
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50 p-4 md:p-6 text-sm font-medium text-gray-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-gray-200 transition-colors">
                      {t('compare.row.atm')}
                  </td>
                  <td className="p-4 md:p-6 text-center text-xs md:text-base text-gray-600 border-l border-gray-100">{t('compare.val.std')}</td>
                  <td className="p-4 md:p-6 text-center text-xs md:text-base text-gray-600 border-l border-gray-100 bg-blue-50/30">{t('compare.val.std')}</td>
                  <td className="p-4 md:p-6 text-center text-xs md:text-base text-gray-900 font-medium border-l border-gray-100">{t('compare.val.refunds')}</td>
                </tr>

                {/* Online Banking */}
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50 p-4 md:p-6 text-sm font-medium text-gray-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-gray-200 transition-colors">
                      {t('compare.row.digital')}
                  </td>
                  <td className="p-4 md:p-6 text-center border-l border-gray-100">
                    {renderBoolean(true)}
                  </td>
                  <td className="p-4 md:p-6 text-center border-l border-gray-100 bg-blue-50/30">
                    {renderBoolean(true)}
                  </td>
                  <td className="p-4 md:p-6 text-center border-l border-gray-100">
                    {renderBoolean(true)}
                  </td>
                </tr>

                {/* CTA Buttons */}
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td className="sticky left-0 z-10 bg-gray-50 p-4 md:p-6 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-gray-200"></td>
                  <td className="p-4 md:p-6 border-l border-gray-200">
                    <a href="https://www.lamarnationalbank.com/contact-us/" target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2.5 md:py-3 px-2 md:px-4 bg-lamar-blue text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm whitespace-nowrap">
                      {t('compare.btn.open')}
                    </a>
                  </td>
                  <td className="p-4 md:p-6 border-l border-gray-200 bg-blue-50/30">
                    <a href="https://www.lamarnationalbank.com/contact-us/" target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2.5 md:py-3 px-2 md:px-4 bg-lamar-blue text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm whitespace-nowrap">
                      {t('compare.btn.open')}
                    </a>
                  </td>
                  <td className="p-4 md:p-6 border-l border-gray-200">
                    <a href="https://www.lamarnationalbank.com/contact-us/" target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2.5 md:py-3 px-2 md:px-4 bg-lamar-navy text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-sm text-sm whitespace-nowrap">
                      {t('compare.btn.open')}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Scroll Hint for Mobile */}
          <div className="md:hidden absolute top-1/2 right-2 pointer-events-none text-gray-400 bg-white/80 p-1 rounded-full animate-pulse">
              <ArrowRight size={20} />
          </div>
        </div>
        
        <div className="mt-8 text-xs md:text-sm text-gray-500 flex items-start gap-2 max-w-4xl mx-auto px-2 md:px-4 justify-center md:justify-start">
            <HelpCircle size={14} className="mt-0.5 flex-shrink-0" />
            <p>
                * {t('compare.disclaimer')}
            </p>
        </div>
      </div>
    </div>
  );
};
