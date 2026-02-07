// Imports
import React from 'react';
import { LoginWidget } from './LoginWidget';
import { useLanguage } from './LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Stagger, FadeIn } from './ui/Stagger';
import { MagneticButton } from './ui/MagneticButton';

interface HeroProps {
    onNavigate: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
    const { t } = useLanguage();

    return (
        <div className="relative w-full bg-lamar-navy lg:min-h-[90vh] flex items-center overflow-hidden group">
            {/* Animated Background Image Container */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1541451378359-ac3e43846618?q=80&w=2070&auto=format&fit=crop"
                    alt="Texas Capital"
                    className="w-full h-full object-cover object-center animate-slow-zoom opacity-60"
                />
                {/* Cinematic Gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-lamar-navy via-lamar-navy/95 to-lamar-navy/40"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,44,95,0)_0%,rgba(0,44,95,1)_100%)]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-lamar-navy via-transparent to-transparent"></div>

                {/* Abstract Tech Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
            </div>

            {/* Content Container */}
            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between py-24 md:py-32 gap-16">

                {/* Left Side: Marketing Message */}
                <Stagger className="flex-1 text-white z-10 max-w-4xl">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lamar-navy border border-lamar-gold/30 text-xs font-mono tracking-widest text-lamar-gold mb-8 shadow-lg uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lamar-gold opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-lamar-gold"></span>
                            </span>
                            [ 01 — SYSTEM ] The Future of Texas Banking
                        </div>
                    </FadeIn>

                    <FadeIn>
                        <h1 className="text-7xl md:text-9xl font-heading font-black mb-8 leading-[0.9] -tracking-[0.05em] text-white drop-shadow-2xl">
                            {t('hero.title') || "Banking Reimagined."}
                        </h1>
                    </FadeIn>

                    <FadeIn>
                        <p className="text-xl md:text-2xl font-light max-w-xl text-gray-300 leading-relaxed mb-12 border-l-2 border-lamar-gold pl-6">
                            {t('hero.subtitle')}
                        </p>
                    </FadeIn>

                    <FadeIn className="flex flex-wrap gap-6">
                        <MagneticButton onClick={() => onNavigate('personal')}>
                            <button className="group relative px-8 py-5 bg-lamar-red text-white font-bold rounded-full overflow-hidden shadow-2xl hover:shadow-red-900/50 transition-all">
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                <span className="relative flex items-center gap-3 text-lg">
                                    {t('hero.cta.open')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </MagneticButton>

                        <MagneticButton onClick={() => onNavigate('locations')}>
                            <button className="group px-8 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center gap-3 text-lg">
                                {t('hero.cta.find')}
                            </button>
                        </MagneticButton>
                    </FadeIn>
                </Stagger>

                {/* Right Side: Login Widget */}
                <div className="w-full md:w-[400px] flex-shrink-0 z-20 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                    <div className="bg-lamar-navy border border-lamar-gold/20 rounded-3xl p-2 shadow-2xl ring-1 ring-white/5">
                        <LoginWidget onNavigate={onNavigate} />
                    </div>
                </div>
            </div>
        </div>
    );
};
