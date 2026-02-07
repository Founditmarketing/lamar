import React, { useState } from 'react';
import { BookOpen, Search, Lightbulb, GraduationCap, ArrowRight, Loader2, Target, TrendingUp, Home, Sparkles, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from './LanguageContext';

export const EducationPage: React.FC = () => {
  const { t } = useLanguage();
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState<{ simple: string; analogy: string } | null>(null);
  const [loadingTerm, setLoadingTerm] = useState(false);
  
  const [activePath, setActivePath] = useState<string | null>(null);
  const [pathPlan, setPathPlan] = useState<string[] | null>(null);
  const [loadingPath, setLoadingPath] = useState(false);
  const [pathError, setPathError] = useState<string | null>(null);

  const cleanJson = (text: string) => {
      let cleaned = text.trim();
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
          cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
      return cleaned;
  };

  // Feature 1: Jargon Buster
  const handleExplainTerm = async () => {
    if (!term.trim()) return;
    setLoadingTerm(true);
    setDefinition(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            Explain the financial term "${term}" to a beginner.
            Output ONLY raw JSON (no markdown).
            Format:
            {
                "simple": "A one sentence simple definition.",
                "analogy": "A relatable real-world analogy (e.g., comparing interest to renting money)."
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const cleanedText = cleanJson(response.text || '{}');
        const data = JSON.parse(cleanedText);
        setDefinition(data);
    } catch (e) {
        console.error(e);
        setDefinition({
            simple: "We couldn't define that term right now.",
            analogy: "Please try again later."
        });
    } finally {
        setLoadingTerm(false);
    }
  };

  // Feature 2: Personalized Pathways
  const handleGeneratePath = async (goal: string) => {
      setActivePath(goal);
      setLoadingPath(true);
      setPathPlan(null);
      setPathError(null);

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            Create a simple 3-step action plan for a banking customer who wants to: "${goal}".
            Each step should be 1 sentence.
            Output ONLY raw JSON (no markdown).
            Format:
            {
                "steps": ["Step 1...", "Step 2...", "Step 3..."]
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const cleanedText = cleanJson(response.text || '{}');
        const data = JSON.parse(cleanedText);
        if (!data.steps || !Array.isArray(data.steps)) {
            throw new Error("Invalid format");
        }
        setPathPlan(data.steps || []);

      } catch (e) {
          console.error(e);
          setPathError("Unable to generate plan. Please try again.");
      } finally {
          setLoadingPath(false);
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6">
            <div className="hidden md:block p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <GraduationCap size={48} className="text-teal-100" />
            </div>
            <div>
                <h1 className="text-4xl font-bold mb-4">{t('edu.title')}</h1>
                <p className="text-xl text-teal-100 max-w-2xl">
                    {t('edu.subtitle')}
                </p>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Tool 1: Jargon Buster */}
            <div className="bg-white rounded-xl shadow-lg border-t-4 border-teal-500 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-teal-50/30">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Search className="text-teal-600" /> {t('edu.jargon.title')}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {t('edu.jargon.desc')}
                    </p>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleExplainTerm()}
                            placeholder={t('edu.jargon.placeholder')}
                            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-lg"
                        />
                        <button 
                            onClick={handleExplainTerm}
                            disabled={loadingTerm || !term}
                            className="absolute right-2 top-2 bottom-2 bg-teal-600 text-white px-4 rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors"
                        >
                            {loadingTerm ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                        </button>
                    </div>

                    {definition && (
                        <div className="bg-teal-50 rounded-xl p-6 border border-teal-100 animate-fadeIn space-y-4">
                            <div>
                                <h3 className="font-bold text-teal-900 text-lg mb-1">{term}</h3>
                                <p className="text-gray-800 leading-relaxed">{definition.simple}</p>
                            </div>
                            <div className="flex gap-3 items-start bg-white p-4 rounded-lg border border-teal-100 shadow-sm">
                                <Lightbulb className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <span className="font-bold text-gray-900 text-sm uppercase tracking-wide block mb-1">{t('edu.result.analogy')}</span>
                                    <p className="text-gray-600 italic">"{definition.analogy}"</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tool 2: Pathways */}
            <div className="bg-white rounded-xl shadow-lg border-t-4 border-purple-500 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-purple-50/30">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Target className="text-purple-600" /> {t('edu.path.title')}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {t('edu.path.desc')}
                    </p>
                </div>
                
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                        {[
                            { id: 'Home', icon: Home, label: t('edu.path.home') },
                            { id: 'Credit', icon: TrendingUp, label: t('edu.path.credit') },
                            { id: 'Retire', icon: BookOpen, label: t('edu.path.retire') },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleGeneratePath(item.label)}
                                className={`p-4 rounded-lg border text-left transition-all ${
                                    activePath === item.label 
                                    ? 'bg-purple-100 border-purple-500 ring-1 ring-purple-500' 
                                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                }`}
                            >
                                <item.icon className={`mb-2 ${activePath === item.label ? 'text-purple-700' : 'text-gray-500'}`} />
                                <span className={`font-semibold block ${activePath === item.label ? 'text-purple-900' : 'text-gray-700'}`}>
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {loadingPath && (
                        <div className="flex flex-col items-center justify-center py-8 text-purple-600">
                            <Loader2 className="animate-spin mb-2" size={32} />
                            <span className="text-sm font-medium">{t('edu.gen.plan')}</span>
                        </div>
                    )}

                    {pathError && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-center gap-3 animate-fadeIn">
                            <AlertCircle className="text-red-500" size={20} />
                            <span className="text-red-700 text-sm">{pathError}</span>
                        </div>
                    )}

                    {pathPlan && !loadingPath && !pathError && (
                        <div className="animate-fadeIn">
                             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Sparkles size={16} className="text-purple-500" /> {t('edu.plan.header')}
                             </h3>
                             <div className="space-y-4">
                                {pathPlan.map((step, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center border border-purple-200">
                                            {idx + 1}
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex-grow">
                                            <p className="text-gray-800">{step}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>
            </div>

        </div>

        {/* Static Content Bottom */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
            <BookOpen className="mx-auto text-teal-600 mb-4" size={48} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('edu.cta.title')}</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                {t('edu.cta.desc')}
            </p>
            <a href="https://www.lamarnationalbank.com/contact-us/" className="inline-block bg-lamar-navy text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors">
                {t('edu.cta.btn')}
            </a>
        </div>
      </div>
    </div>
  );
};
