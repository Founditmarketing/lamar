import React, { useState } from 'react';
import { Briefcase, TrendingUp, Users, PieChart, Sparkles, Loader2, ArrowRight, Lightbulb, Target, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from './LanguageContext';

interface StrategyResult {
    insight: string;
    productRecommendation: string;
    nextSteps: string[];
}

export const BusinessPage: React.FC = () => {
  const { t } = useLanguage();
  
  // Growth Strategist State
  const [industry, setIndustry] = useState('');
  const [revenue, setRevenue] = useState('');
  const [focus, setFocus] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [strategy, setStrategy] = useState<StrategyResult | null>(null);

  const cleanJson = (text: string) => {
      let cleaned = text.trim();
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
          cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
      return cleaned;
  };

  const handleGenerateStrategy = async () => {
    if (!industry || !revenue || !focus) return;
    setAiLoading(true);
    setStrategy(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            Act as a senior commercial banking consultant for Lamar National Bank.
            Analyze this business profile:
            - Industry: ${industry}
            - Annual Revenue: $${revenue}
            - Current Strategic Focus: ${focus}

            Products Available:
            - SBA Loan (Growth/Acquisition)
            - Commercial Line of Credit (Working Capital)
            - Equipment Financing (Assets)
            - Commercial Real Estate Loan (Property)
            - Treasury Management (Cash Flow Optimization)

            Task:
            1. Provide a "Strategic Insight" (1-2 sentences on market context or opportunity).
            2. Recommend the ONE best Lamar National product.
            3. List 3 concrete "Next Steps" for the business owner.

            Output ONLY raw JSON (no markdown).
            Format:
            {
                "insight": "...",
                "productRecommendation": "...",
                "nextSteps": ["Step 1", "Step 2", "Step 3"]
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const cleanedText = cleanJson(response.text || '{}');
        const data = JSON.parse(cleanedText);
        setStrategy(data);
    } catch (e) {
        console.error(e);
        // Fallback for demo if API fails
        setStrategy({
            insight: "Your business is in a strong position for growth, but careful cash flow management is key during expansion.",
            productRecommendation: "Commercial Line of Credit",
            nextSteps: [
                "Gather last 2 years of tax returns",
                "Prepare a current P&L statement",
                "Schedule a meeting with a Lamar Commercial Lender"
            ]
        });
    } finally {
        setAiLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 pb-16">
      {/* Page Hero */}
      <div className="bg-lamar-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
             <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" alt="Office Building" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('business.title')}</h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            {t('business.subtitle')}
          </p>
          <a href="https://www.lamarnationalbank.com/business/commercial-lending/" target="_blank" rel="noopener noreferrer" className="inline-block mt-8 bg-lamar-accent hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
            {t('business.cta')}
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
                <section id="lending" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <Briefcase className="text-lamar-blue" /> {t('business.lending.title')}
                    </h2>
                    <p className="text-gray-600 mb-6 text-lg">
                        {t('business.lending.desc')}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-2">{t('business.re.title')}</h4>
                            <p className="text-sm text-gray-500">{t('business.re.desc')}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-2">{t('business.eq.title')}</h4>
                            <p className="text-sm text-gray-500">{t('business.eq.desc')}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-2">{t('business.loc.title')}</h4>
                            <p className="text-sm text-gray-500">{t('business.loc.desc')}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-2">{t('business.sba.title')}</h4>
                            <p className="text-sm text-gray-500">{t('business.sba.desc')}</p>
                        </div>
                    </div>
                </section>

                <section id="treasury" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <PieChart className="text-lamar-blue" /> {t('business.treasury.title')}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {t('business.treasury.desc')}
                    </p>
                    <ul className="space-y-3">
                        {[
                          t('business.treasury.list1'),
                          t('business.treasury.list2'),
                          t('business.treasury.list3'),
                          t('business.treasury.list4')
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-lamar-accent rounded-full"></div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8 sticky top-24 h-fit">
                
                {/* Business Growth Strategist Tool */}
                <div className="bg-gradient-to-br from-gray-900 via-lamar-navy to-blue-900 rounded-xl shadow-2xl overflow-hidden text-white border border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4 text-blue-300 font-bold uppercase text-xs tracking-wider">
                            <Sparkles size={14} /> {t('biz.growth.title')}
                        </div>
                        <p className="text-sm text-gray-300 mb-6 border-b border-gray-700 pb-4">
                            {t('biz.growth.subtitle')}
                        </p>
                        
                        {!strategy ? (
                            <div className="space-y-4 animate-fadeIn">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t('biz.growth.industry')}</label>
                                    <input 
                                        type="text" 
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all text-sm"
                                        placeholder="e.g. Construction, Tech, Retail"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t('biz.growth.revenue')}</label>
                                    <input 
                                        type="text" 
                                        value={revenue}
                                        onChange={(e) => setRevenue(e.target.value)}
                                        className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all text-sm"
                                        placeholder="e.g. 1,000,000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t('biz.growth.focus')}</label>
                                    <input 
                                        type="text"
                                        value={focus}
                                        onChange={(e) => setFocus(e.target.value)}
                                        className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all text-sm"
                                        placeholder="e.g. Expanding fleet, Buying warehouse"
                                    />
                                </div>
                                <button 
                                    onClick={handleGenerateStrategy}
                                    disabled={aiLoading || !revenue || !industry || !focus}
                                    className="w-full bg-gradient-to-r from-lamar-accent to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
                                >
                                    {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Target size={18} />}
                                    {aiLoading ? t('biz.growth.analyzing') : t('biz.growth.btn')}
                                </button>
                            </div>
                        ) : (
                            <div className="animate-slideUp bg-white/5 rounded-lg border border-white/10 p-5">
                                <div className="mb-4 pb-4 border-b border-white/10">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-blue-300 mb-2">
                                        <Lightbulb size={16} /> {t('biz.growth.insight')}
                                    </h4>
                                    <p className="text-sm text-gray-300 leading-relaxed italic">
                                        "{strategy.insight}"
                                    </p>
                                </div>
                                
                                <div className="mb-4">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-green-400 mb-2">
                                        <CheckCircle2 size={16} /> {t('biz.growth.recommendation')}
                                    </h4>
                                    <div className="bg-green-400/10 text-green-300 px-3 py-2 rounded font-semibold text-sm border border-green-400/20">
                                        {strategy.productRecommendation}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">{t('biz.growth.steps')}</h4>
                                    <ul className="space-y-2">
                                        {strategy.nextSteps.map((step, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                                <span className="bg-white/10 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">{i + 1}</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button 
                                    onClick={() => setStrategy(null)}
                                    className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded transition-colors"
                                >
                                    Start Over
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Directory Box */}
                <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-lamar-blue">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{t('business.sidebar.title')}</h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <Users className="text-gray-400 mt-1" />
                            <div>
                                <h4 className="font-semibold text-gray-900">{t('business.team.title')}</h4>
                                <p className="text-sm text-gray-500 mt-1">{t('business.team.desc')}</p>
                                <a href="https://www.lamarnationalbank.com/business/commercial-lending/" target="_blank" rel="noopener noreferrer" className="text-lamar-blue text-sm font-medium mt-2 inline-block hover:underline">{t('business.team.link')} &rarr;</a>
                            </div>
                        </div>
                        <div className="w-full h-px bg-gray-100"></div>
                        <div id="rates" className="flex items-start gap-4 scroll-mt-24">
                            <TrendingUp className="text-gray-400 mt-1" />
                            <div>
                                <h4 className="font-semibold text-gray-900">{t('business.rates.title')}</h4>
                                <p className="text-sm text-gray-500 mt-1">{t('business.rates.desc')}</p>
                                <a href="https://www.lamarnationalbank.com/rates/" target="_blank" rel="noopener noreferrer" className="text-lamar-blue text-sm font-medium mt-2 inline-block hover:underline">{t('business.rates.link')} &rarr;</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
