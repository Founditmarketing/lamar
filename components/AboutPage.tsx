import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Heart, Users, Shield, Award, ArrowRight, History, Landmark } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { Stagger, FadeIn } from './ui/Stagger';
import { MagneticButton } from './ui/MagneticButton';

interface AboutPageProps {
    onNavigate?: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
    const { t } = useLanguage();

    const handleNavigate = (page: string) => {
        if (onNavigate) {
            onNavigate(page);
        } else if ((window as any).appNavigate) {
            (window as any).appNavigate(page);
        }
    };

    const stats = [
        { label: 'Founded', value: '1933', icon: History },
        { label: 'Locations', value: '7+', icon: MapPin },
        { label: 'Community Focused', value: '100%', icon: Heart },
        { label: 'Texas Roots', value: 'Deep', icon: Landmark },
    ];

    const values = [
        {
            title: t('about.val.longevity.title'),
            desc: t('about.val.longevity.desc'),
            icon: Clock,
            color: 'bg-lamar-navy'
        },
        {
            title: t('about.val.community.title'),
            desc: t('about.val.community.desc'),
            icon: Users,
            color: 'bg-lamar-gold'
        },
        {
            title: t('about.val.service.title'),
            desc: t('about.val.service.desc'),
            icon: Heart,
            color: 'bg-lamar-accent'
        },
        {
            title: 'Institutional Stability',
            desc: 'A pillar of strength through nearly a century of economic changes.',
            icon: Shield,
            color: 'bg-lamar-navy'
        },
        {
            title: 'Texas Leadership',
            desc: 'Led by local business owners and visionaries who live where you do.',
            icon: Award,
            color: 'bg-lamar-gold'
        }
    ];

    return (
        <div className="bg-white overflow-hidden">
            {/* --- Hero Section --- */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <motion.img
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.6 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src="https://images.unsplash.com/photo-1541451378359-ac3e43846618?q=80&w=2070"
                        alt="Texas Legacy"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-lamar-navy/90 via-lamar-navy/70 to-white"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <Stagger>
                        <FadeIn>
                            <span className="inline-block py-1 px-3 mb-4 md:mb-6 rounded-full bg-lamar-gold/20 border border-lamar-gold/30 text-lamar-gold text-[10px] md:text-xs font-mono tracking-widest uppercase">
                                Est. 1933 — Texas, USA
                            </span>
                        </FadeIn>
                        <FadeIn>
                            <h1 className="text-4xl sm:text-5xl md:text-8xl font-heading font-black text-white mb-6 md:mb-8 tracking-tighter leading-[1.1] md:leading-none">
                                {t('about.hero.title')}
                            </h1>
                        </FadeIn>
                        <FadeIn>
                            <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed px-4 md:px-0">
                                {t('about.hero.subtitle')}
                            </p>
                        </FadeIn>
                    </Stagger>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* --- Stats Ribbon --- */}
            <section className="relative z-20 -mt-10 md:-mt-16 max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="text-center"
                        >
                            <div className="flex justify-center mb-2 md:mb-4">
                                <stat.icon className="text-lamar-gold" size={20} />
                            </div>
                            <div className="text-2xl md:text-4xl font-heading font-black text-lamar-navy mb-1">{stat.value}</div>
                            <div className="text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- The Story Section --- */}
            <section className="py-16 md:py-32 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
                    <div className="relative group">
                        <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-24 h-24 md:w-40 md:h-40 bg-lamar-gold/10 rounded-full blur-2xl md:blur-3xl animate-pulse"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl skew-y-1 md:skew-y-1 group-hover:skew-y-0 transition-transform duration-700">
                            <img
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070"
                                alt="Our History"
                                className="w-full h-[350px] md:h-[600px] object-cover"
                            />
                            <div className="absolute inset-0 bg-lamar-navy/20 mix-blend-overlay"></div>
                        </div>
                        {/* Quote Overlay */}
                        <div className="absolute -bottom-6 -right-4 md:-bottom-8 md:-right-8 bg-lamar-accent p-5 md:p-8 rounded-xl md:rounded-2xl shadow-2xl max-w-[200px] md:max-w-xs transform md:translate-x-0">
                            <p className="text-white font-heading font-bold italic text-base md:text-xl leading-snug">
                                "The bank that knows your name and understands your roots."
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 md:space-y-8 mt-12 md:mt-0">
                        <div>
                            <h2 className="text-xs font-mono text-lamar-gold tracking-[0.3em] uppercase mb-4">The Lamar Legacy</h2>
                            <h3 className="text-4xl md:text-6xl font-heading font-black text-lamar-navy leading-[1.1]">
                                {t('about.story.title')}
                            </h3>
                        </div>

                        <div className="space-y-4 md:space-y-6 text-lg md:text-xl text-gray-600 font-light leading-relaxed">
                            <p>
                                {t('about.story.p1')}
                            </p>
                            <div className="w-16 md:w-20 h-1 bg-lamar-gold rounded-full"></div>
                            <p>
                                {t('about.story.p2')}
                            </p>
                        </div>

                        <div className="pt-4 md:pt-8">
                            <MagneticButton onClick={() => handleNavigate('contact')}>
                                <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-lamar-navy text-white px-8 py-4 rounded-full font-bold hover:bg-lamar-navy/90 transition-all shadow-xl">
                                    Join Our Community <ArrowRight size={20} />
                                </button>
                            </MagneticButton>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Values Grid Section --- */}
            <section className="py-20 md:py-32 bg-gray-50 relative overflow-hidden">
                {/* Background Text Decor */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden select-none opacity-[0.02] hidden md:block">
                    <div className="text-[20rem] font-black text-lamar-navy whitespace-nowrap -translate-x-1/4">
                        VALUED — SERVICE — TRUST
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-16 md:mb-24">
                        <h2 className="text-3xl md:text-5xl font-heading font-black text-lamar-navy mb-4 md:mb-6">Our Core Principles</h2>
                        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-light">
                            Foundational beliefs that have guided us since our first day in 1933.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-white p-8 md:p-10 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                            >
                                <div className={`w-12 h-12 md:w-16 md:h-16 ${value.color} text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:rotate-6 transition-transform duration-500 shadow-lg`}>
                                    <value.icon size={28} className="md:w-8 md:h-8" />
                                </div>
                                <h4 className="text-xl md:text-2xl font-bold text-lamar-navy mb-3 md:mb-4">{value.title}</h4>
                                <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">{value.desc}</p>

                                {/* Decorative Line */}
                                <div className="absolute bottom-0 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-lamar-gold/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Leadership / CTA Section --- */}
            <section className="py-24 md:py-40 bg-lamar-navy relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    <Stagger>
                        <FadeIn>
                            <h2 className="text-4xl md:text-7xl font-heading font-black text-white mb-6 md:mb-8 tracking-tight">
                                {t('about.lead.title')}
                            </h2>
                        </FadeIn>
                        <FadeIn>
                            <p className="text-lg md:text-2xl text-gray-300 mb-10 md:mb-16 max-w-3xl mx-auto font-light leading-relaxed">
                                {t('about.lead.desc')}
                            </p>
                        </FadeIn>
                        <FadeIn className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
                            <MagneticButton>
                                <button className="w-full md:w-auto bg-lamar-gold text-lamar-navy px-10 py-4 md:py-5 rounded-full font-black text-base md:text-lg hover:bg-white transition-all shadow-2xl">
                                    {t('about.lead.btn')}
                                </button>
                            </MagneticButton>
                            <MagneticButton onClick={() => handleNavigate('locations')}>
                                <button className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 md:py-5 rounded-full font-black text-base md:text-lg hover:bg-white/20 transition-all">
                                    {t('hero.cta.find')}
                                </button>
                            </MagneticButton>
                        </FadeIn>
                    </Stagger>
                </div>

                {/* Decorative Texas Abstract Overlay */}
                <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
            </section>
        </div>
    );
};
