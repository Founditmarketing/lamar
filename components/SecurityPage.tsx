import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Lock, AlertTriangle, ScanLine, Loader2, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from './LanguageContext';

export const SecurityPage: React.FC = () => {
    const { t } = useLanguage();
    const [scamText, setScamText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        risk: 'safe' | 'suspicious' | 'danger';
        explanation: string;
    } | null>(null);

    const cleanJson = (text: string) => {
        let cleaned = text.trim();
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }
        return cleaned;
    };

    const analyzeScam = async () => {
        if (!scamText.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are a banking security expert AI. 
                Analyze the following text message or email content for signs of a phishing scam or fraud.
                
                Content to analyze: "${scamText}"

                Task:
                1. Determine the risk level: "Safe" (standard notification), "Suspicious" (unusual but inconclusive), or "High Risk" (clear scam signs like urgency, bad links, requesting secrets).
                2. Provide a 2-sentence explanation of why.

                Output ONLY raw JSON (no markdown).
                Format:
                {
                    "risk": "safe" | "suspicious" | "danger",
                    "explanation": "Your explanation here."
                }
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            const cleanedText = cleanJson(response.text || '{}');
            const jsonResponse = JSON.parse(cleanedText);
            setResult({
                risk: jsonResponse.risk?.toLowerCase() || 'suspicious',
                explanation: jsonResponse.explanation || "Unable to determine specifics, but proceed with caution."
            });

        } catch (error) {
            console.error(error);
            setResult({
                risk: 'suspicious',
                explanation: "We couldn't process this text fully, but always verify the sender before clicking links."
            });
        } finally {
            setLoading(false);
        }
    };

    const getRiskStyles = (risk: string) => {
        switch (risk) {
            case 'safe': return 'bg-green-50 border-green-200 text-green-800';
            case 'danger': return 'bg-blue-50 border-blue-200 text-blue-800';
            default: return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        }
    };

    const getRiskIcon = (risk: string) => {
        switch (risk) {
            case 'safe': return <CheckCircle2 size={24} className="text-green-600" />;
            case 'danger': return <ShieldAlert size={24} className="text-blue-600" />;
            default: return <AlertTriangle size={24} className="text-yellow-600" />;
        }
    };

    const getRiskTitle = (risk: string) => {
        switch (risk) {
            case 'safe': return t('sec.result.safe');
            case 'danger': return t('sec.result.danger');
            default: return t('sec.result.suspicious');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            {/* Compact Hero */}
            <div className="bg-lamar-navy text-white py-8 md:py-10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute right-0 top-0 transform translate-x-1/4 -translate-y-1/4">
                        <ShieldCheck size={250} />
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">{t('sec.title')}</h1>
                                <p className="text-blue-200 text-sm hidden md:block max-w-lg">{t('sec.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-blue-200 text-sm md:hidden mt-3 leading-relaxed">{t('sec.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Tool: AI Scam Detector */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full">
                            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <ScanLine className="text-lamar-blue" size={20} />
                                    {t('sec.scam.title')}
                                </h2>
                                <p className="text-gray-500 mt-1.5 text-sm">
                                    {t('sec.scam.desc')}
                                </p>
                            </div>

                            <div className="p-5 flex-grow flex flex-col">
                                <div className="mb-4">
                                    <textarea
                                        value={scamText}
                                        onChange={(e) => setScamText(e.target.value)}
                                        placeholder={t('sec.scam.placeholder')}
                                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamar-blue focus:border-transparent resize-none transition-shadow text-gray-700 placeholder-gray-400 text-sm"
                                    />
                                </div>

                                <button
                                    onClick={analyzeScam}
                                    disabled={loading || !scamText}
                                    className="w-full bg-lamar-accent hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                                    {loading ? t('sec.scam.analyzing') : t('sec.scam.btn')}
                                </button>

                                {result && (
                                    <div className={`mt-6 rounded-xl p-4 border animate-fadeIn flex gap-3 items-start ${getRiskStyles(result.risk)}`}>
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getRiskIcon(result.risk)}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold mb-1">{getRiskTitle(result.risk)}</h3>
                                            <p className="opacity-90 leading-relaxed text-sm">
                                                {result.explanation}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Tips */}
                    <div className="h-full">
                        <div className="bg-white rounded-xl shadow-md border-t-4 border-green-500 p-5 h-full flex flex-col">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                                <ShieldCheck className="text-green-600" size={20} />
                                {t('sec.tips.title')}
                            </h3>
                            <ul className="space-y-4 flex-grow">
                                <li className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">1</div>
                                    <p className="text-sm text-gray-600 leading-snug">{t('sec.tips.1')}</p>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">2</div>
                                    <p className="text-sm text-gray-600 leading-snug">{t('sec.tips.2')}</p>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">3</div>
                                    <p className="text-sm text-gray-600 leading-snug">{t('sec.tips.3')}</p>
                                </li>
                            </ul>

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-[10px] text-gray-400 text-center leading-tight">
                                    {t('sec.footer')}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
