import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, CreditCard, Wand2, Lock, Palette, Download } from 'lucide-react';
import { useLanguage } from './LanguageContext';

// Removed conflicting global declaration for window.aistudio to fix TypeScript errors.
// Accessing via (window as any) ensures compatibility with the existing global definition.

type ImageSize = '1K' | '2K' | '4K';

export const CardDesigner: React.FC = () => {
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [prompt, setPrompt] = useState('A majestic Texas Longhorn standing in a field of bluebonnets at sunset');
    const [size, setSize] = useState<ImageSize>('1K');
    const [loading, setLoading] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        checkApiKey();
    }, []);

    const checkApiKey = async () => {
        const aistudio = (window as any).aistudio;
        if (aistudio) {
            const hasKey = await aistudio.hasSelectedApiKey();
            setApiKeySelected(hasKey);
        }
    };

    const handleConnect = async () => {
        const aistudio = (window as any).aistudio;
        if (aistudio) {
            await aistudio.openSelectKey();
            // Assume success after interaction
            setApiKeySelected(true);
        } else {
            setError(t('card.error.unavailable'));
        }
    };

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setError(null);
        
        try {
            // Create instance right before call to use latest key
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: {
                    parts: [{ text: prompt }]
                },
                config: {
                    imageConfig: {
                        imageSize: size,
                        aspectRatio: '16:9'
                    }
                }
            });

            let foundImage = false;
            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64String = part.inlineData.data;
                        setImageSrc(`data:image/png;base64,${base64String}`);
                        foundImage = true;
                        break;
                    }
                }
            }
            
            if (!foundImage) {
                setError(t('card.error.noimage'));
            }

        } catch (err: any) {
            console.error(err);
            if (err.message && err.message.includes("Requested entity was not found")) {
                setApiKeySelected(false);
                setError(t('card.error.api'));
            } else {
                setError(t('card.error.gen'));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!imageSrc) return;
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = `lamar-card-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="py-16 bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-lamar-red text-white p-2 rounded-lg">
                        <Palette size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{t('card.title')}</h2>
                        <p className="text-gray-600">{t('card.subtitle')}</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Controls */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        {!apiKeySelected ? (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center space-y-4">
                                <div className="mx-auto w-12 h-12 bg-blue-100 text-lamar-blue rounded-full flex items-center justify-center">
                                    <Lock size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{t('card.unlock.title')}</h3>
                                <p className="text-sm text-gray-500">
                                    {t('card.unlock.desc')}
                                </p>
                                <button 
                                    onClick={handleConnect}
                                    className="w-full py-2 px-4 bg-lamar-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    {t('card.connect')}
                                </button>
                                <p className="text-xs text-gray-400">
                                    {t('card.see')} <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-lamar-blue">{t('card.billing')}</a> {t('card.details')}.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('card.prompt.label')}
                                    </label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        rows={4}
                                        className="w-full rounded-lg border-gray-300 border p-3 shadow-sm focus:border-lamar-blue focus:ring-lamar-blue transition-colors"
                                        placeholder={t('card.prompt.placeholder')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('card.quality')}
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSize(s)}
                                                className={`py-2 px-3 rounded-md text-sm font-medium border transition-all ${
                                                    size === s 
                                                    ? 'bg-blue-50 border-lamar-blue text-lamar-blue ring-1 ring-lamar-blue' 
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !prompt}
                                    className="w-full flex items-center justify-center py-3 px-4 rounded-full bg-lamar-red text-white font-bold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lamar-red disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={20} />
                                            {t('card.loading')}
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="mr-2" size={20} />
                                            {t('card.generate')}
                                        </>
                                    )}
                                </button>
                                {error && (
                                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                                        {error}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Preview */}
                    <div className="w-full lg:w-2/3 flex items-center justify-center bg-gray-100 rounded-2xl p-8 border border-gray-200 min-h-[400px]">
                        <div className="relative w-full max-w-md">
                            <div className="aspect-[1.586/1] rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 transition-all duration-500 hover:scale-105 relative group">
                                {/* Card Background Image */}
                                {imageSrc ? (
                                    <img 
                                        src={imageSrc} 
                                        alt="Custom Card Design" 
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {!loading && <div className="text-white/20 text-6xl font-bold uppercase tracking-widest select-none">Lamar</div>}
                                    </div>
                                )}

                                {/* Loading Overlay */}
                                {loading && (
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                                        <Loader2 className="text-white animate-spin" size={48} />
                                    </div>
                                )}

                                {/* Card Overlays */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 bg-gradient-to-t from-black/60 via-transparent to-black/30">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-white/90 rounded-sm flex items-center justify-center text-lamar-blue font-bold text-xl">L</div>
                                            <span className="text-white font-bold text-lg tracking-wider drop-shadow-md">LAMAR</span>
                                        </div>
                                        <span className="text-white/90 font-medium text-sm tracking-widest">{t('card.preview.debit')}</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="w-12 h-9 bg-yellow-400/80 rounded-md shadow-sm border border-yellow-300/50 relative overflow-hidden">
                                            <div className="absolute top-1/2 -left-1 w-14 h-[1px] bg-black/20"></div>
                                            <div className="absolute top-1/2 left-2 w-[1px] h-8 bg-black/20"></div>
                                        </div>
                                        
                                        <div className="text-white font-mono text-xl md:text-2xl tracking-widest drop-shadow-md">
                                            4000 1234 5678 9010
                                        </div>
                                        
                                        <div className="flex justify-between items-end text-white/90">
                                            <div className="text-xs uppercase tracking-wider">
                                                <div className="text-[10px] opacity-75">{t('card.holder')}</div>
                                                <div className="font-medium">J. AUSTIN</div>
                                            </div>
                                            <div className="text-xs uppercase tracking-wider">
                                                <div className="text-[10px] opacity-75">{t('card.expires')}</div>
                                                <div className="font-medium">12/28</div>
                                            </div>
                                            <div className="font-bold italic text-lg opacity-90">VISA</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Download Action */}
                            {imageSrc && (
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full hover:bg-black transition-colors shadow-lg text-sm font-semibold"
                                    >
                                        <Download size={18} />
                                        {t('card.download')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
