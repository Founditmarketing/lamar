import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface FooterProps {
    onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    const { t } = useLanguage();

    const otherLocations = ['Reno', 'Celina', 'North Tarrant', 'Frisco', 'Plano', 'Bryan'];

    const handleInternalLink = (e: React.MouseEvent, page: string) => {
        e.preventDefault();
        onNavigate(page);
        window.scrollTo(0, 0);
    };

    return (
        <footer className="bg-lamar-navy text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Brand, Contact & Social */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <img src="/logo.png" alt="Lamar National Bank" className="h-12 w-auto object-contain" />
                        </div>

                        <ul className="space-y-4 text-sm text-gray-300 mb-8">
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-blue-300 flex-shrink-0" />
                                <a href="tel:903-785-0701" aria-label={`${t('footer.aria.call')} 903-785-0701`} className="hover:text-white hover:underline transition-colors">903-785-0701</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-blue-300 flex-shrink-0" />
                                <button onClick={() => onNavigate('contact')} aria-label={t('footer.aria.email')} className="hover:text-white hover:underline transition-colors text-left">{t('footer.contact')}</button>
                            </li>
                            <li className="pl-8">
                                <button onClick={() => onNavigate('lost-card')} className="hover:text-white hover:underline font-medium text-blue-400 hover:text-blue-300 transition-colors text-left">{t('footer.lost')}</button>
                            </li>
                        </ul>

                        <h5 className="font-bold text-gray-100 mb-4 text-xs uppercase tracking-wider">{t('footer.follow')}</h5>
                        <div className="flex space-x-5">
                            <a href="https://www.facebook.com/lamarnationalbank" target="_blank" rel="noreferrer" aria-label={t('footer.social.facebook')} className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="https://twitter.com/lamarnational" target="_blank" rel="noreferrer" aria-label={t('footer.social.twitter')} className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="https://www.instagram.com/lamarnationalbank" target="_blank" rel="noreferrer" aria-label={t('footer.social.instagram')} className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="https://www.linkedin.com/company/lamar-national-bank" target="_blank" rel="noreferrer" aria-label={t('footer.social.linkedin')} className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Column 2: Locations */}
                    <div>
                        <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">{t('footer.locations')}</h4>

                        <div className="flex flex-col gap-4">
                            {/* Main Bank */}
                            <button onClick={() => onNavigate('locations')} className="group bg-white/5 border border-white/10 p-4 rounded-lg hover:bg-white/10 transition-all hover:border-white/20 text-left w-full">
                                <div className="flex items-start gap-3">
                                    <div className="bg-lamar-accent p-1.5 rounded-full mt-0.5">
                                        <MapPin size={14} className="text-white" />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-white text-sm group-hover:underline decoration-lamar-accent underline-offset-4">{t('footer.loc.paris')}</span>
                                        <span className="text-xs text-blue-200 mt-1 block">{t('footer.hq')}</span>
                                    </div>
                                </div>
                            </button>

                            {/* List */}
                            <ul className="space-y-2 text-sm text-gray-400 pl-2 border-l-2 border-gray-700 ml-3">
                                {otherLocations.map(loc => (
                                    <li key={loc}>
                                        <button onClick={() => onNavigate('locations')} className="block pl-4 hover:text-white transition-colors hover:translate-x-1 duration-200 text-left text-gray-300">
                                            {loc}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* View All CTA */}
                            <button onClick={() => onNavigate('locations')} className="inline-flex items-center text-sm font-bold text-blue-400 hover:text-white transition-colors mt-2 group">
                                {t('footer.viewAll')}
                                <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Column 3: About */}
                    <div>
                        <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">{t('footer.about')}</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><button onClick={() => onNavigate('about')} className="hover:text-white hover:underline block transition-colors text-left">{t('footer.story')}</button></li>
                            <li><button onClick={() => onNavigate('careers')} className="hover:text-white hover:underline block transition-colors text-left">{t('footer.careers')}</button></li>
                            <li><button onClick={() => onNavigate('news')} className="hover:text-white hover:underline block transition-colors text-left">{t('footer.news')}</button></li>
                            <li><button onClick={() => onNavigate('investor')} className="hover:text-white hover:underline block transition-colors text-left">{t('footer.investor')}</button></li>
                            <li><button onClick={() => onNavigate('community')} className="hover:text-white hover:underline block transition-colors text-left">{t('footer.community')}</button></li>
                        </ul>
                    </div>

                    {/* Column 4: Resources */}
                    <div>
                        <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">{t('footer.resources')}</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><a href="https://www.dob.texas.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline block transition-colors">{t('footer.dobLink')}</a></li>
                            <li><button onClick={() => onNavigate('privacy')} className="hover:text-white hover:underline block transition-colors text-left">{t('footer.privacy')}</button></li>
                            <li><button onClick={() => onNavigate('disclosures')} className="hover:text-white hover:underline block transition-colors text-left">{t('footer.terms')}</button></li>
                            <li><button onClick={() => onNavigate('security')} className="hover:text-white hover:underline block transition-colors text-left">{t('footer.security')}</button></li>
                            <li><button onClick={() => onNavigate('accessibility')} className="hover:text-white hover:underline block transition-colors text-left">{t('footer.accessibility')}</button></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright & Legal */}
                <div className="border-t border-gray-700 pt-8 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
                        <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                            <span>NMLS #419266</span>
                            <a href="https://www.dob.texas.gov/" target="_blank" rel="noreferrer" className="hover:text-white hover:underline transition-colors">{t('footer.dobNotice')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
