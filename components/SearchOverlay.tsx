import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Sparkles, Globe, ArrowRight, Mic } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from './LanguageContext';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    initialQuery?: string;
}

interface SearchSource {
    uri: string;
    title: string;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, initialQuery }) => {
    const [query, setQuery] = useState(initialQuery || '');
    const [result, setResult] = useState<string | null>(null);
    const [sources, setSources] = useState<SearchSource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { t } = useLanguage();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (isOpen && initialQuery) {
            setQuery(initialQuery);
            handleSearch(initialQuery);
        } else if (!isOpen) {
            // Reset state when closed
            setQuery('');
            setResult(null);
            setSources([]);
            setError(null);
            setIsListening(false);
        }
    }, [isOpen, initialQuery]);

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);
        setSources([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: searchQuery,
                config: {
                    tools: [{ googleSearch: {} }]
                }
            });

            setResult(response.text || '');

            // Extract grounding chunks if available
            const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (chunks) {
                const extractedSources = chunks
                    .map((chunk: any) => chunk.web)
                    .filter((web: any) => web && web.uri && web.title);
                setSources(extractedSources);
            }

        } catch (err) {
            console.error("Search error:", err);
            setError(t('search.modal.error'));
        } finally {
            setIsLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            // Stop listening logic would go here if we had a persistent reference,
            // but standard speech recognition stops automatically on silence.
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError(t('search.err.voice'));
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            handleSearch(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            if (event.error !== 'no-speech') {
                setError(t('search.err.hear'));
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(query);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-start pt-16 md:pt-24 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all transform scale-100 opacity-100">

                {/* Search Bar Header */}
                <div className="flex items-center p-4 border-b border-gray-100 gap-2">
                    <Search className="text-gray-400 ml-2" size={24} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('search.modal.placeholder')}
                        className="flex-grow text-xl md:text-2xl px-4 py-2 outline-none text-gray-800 placeholder-gray-300 font-medium"
                    />

                    {/* Voice Button */}
                    <button
                        onClick={toggleListening}
                        className={`p-3 rounded-full transition-all duration-300 ${isListening
                                ? 'bg-blue-100 text-blue-600 animate-pulse ring-2 ring-blue-400'
                                : 'hover:bg-gray-100 text-gray-500'
                            }`}
                        title="Search by voice"
                    >
                        <Mic size={24} />
                    </button>

                    {isLoading ? (
                        <Loader2 className="animate-spin text-lamar-blue mx-2" size={24} />
                    ) : (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Results Area */}
                <div className="overflow-y-auto p-6 md:p-8 bg-gray-50 flex-grow min-h-[300px]">

                    {error && (
                        <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-100 text-center">
                            {error}
                        </div>
                    )}

                    {isListening && !error && (
                        <div className="text-center py-8">
                            <div className="inline-block p-4 rounded-full bg-red-50 mb-3">
                                <Mic size={32} className="text-red-500 animate-bounce" />
                            </div>
                            <p className="text-gray-600 font-medium">{t('live.status.listening')}</p>
                        </div>
                    )}

                    {!result && !isLoading && !error && !isListening && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-4 py-12">
                            <Sparkles size={48} className="text-blue-200" />
                            <p className="text-lg">{t('search.modal.default')}</p>
                        </div>
                    )}

                    {/* AI Answer */}
                    {result && !isListening && (
                        <div className="animate-fadeIn">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="mt-1 bg-gradient-to-br from-lamar-blue to-purple-600 text-white p-2 rounded-lg shadow-md flex-shrink-0">
                                    <Sparkles size={20} />
                                </div>
                                <div className="prose prose-blue max-w-none">
                                    <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">{result}</p>
                                </div>
                            </div>

                            {/* Sources */}
                            {sources.length > 0 && (
                                <div className="mt-8 border-t border-gray-200 pt-6">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Globe size={14} /> {t('search.modal.sources')}
                                    </h4>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {sources.map((source, index) => (
                                            <a
                                                key={index}
                                                href={source.uri}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-lamar-blue hover:shadow-sm transition-all group"
                                            >
                                                <span className="text-sm font-medium text-gray-700 truncate mr-2 group-hover:text-lamar-blue">
                                                    {source.title}
                                                </span>
                                                <ArrowRight size={14} className="text-gray-300 group-hover:text-lamar-blue" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 text-xs text-gray-400 text-center">
                                {t('search.modal.grounding_info')}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
