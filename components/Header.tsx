import React, { useState } from 'react';
import { Menu, Search, X, ChevronRight } from 'lucide-react';
import { NavItem } from '../types';
import { useLanguage } from './LanguageContext';
import { SearchOverlay } from './SearchOverlay';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { language, setLanguage, t } = useLanguage();

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const handleMobileSearchSubmit = () => {
    if (searchQuery.trim()) {
      setIsMobileMenuOpen(false);
      setIsSearchOverlayOpen(true);
      // The searchQuery state will be passed to overlay, but we need to ensure it triggers.
      // The SearchOverlay accepts an initialQuery prop.
    }
  };

  const NAV_ITEMS: NavItem[] = [
    { label: t('nav.personal'), href: 'personal' },
    { label: t('nav.business'), href: 'business' },
    { label: t('nav.resources'), href: 'resources' },
    { label: t('nav.about'), href: 'about' },
  ];

  return (
    <>
      <header className="bg-lamar-blue/95 backdrop-blur-md border-b border-white/10 text-white w-full shadow-lg z-50 sticky top-0 transition-all duration-300">
        {/* Top utility bar */}
        <div className="bg-lamar-navy text-xs py-1 px-4 hidden md:flex justify-end gap-4 text-gray-300">
          <button onClick={() => handleNavClick('locations')} className="hover:text-white transition-colors">{t('nav.atm')}</button>
          <button onClick={toggleLanguage} className="hover:text-white transition-colors font-semibold" aria-label={`Change language to ${language === 'en' ? 'Spanish' : 'English'}`}>
            {t('nav.language')}
          </button>
          <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">{t('nav.support')}</button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-1"
              onClick={() => handleNavClick('home')}
              aria-label="Lamar National Bank Home"
            >
              <img src="/logo.png" alt="Lamar National Bank" className="h-10 w-auto object-contain" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`text-sm font-semibold hover:text-white transition-all py-2 border-b-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded ${currentPage === item.href
                    ? 'border-white text-white opacity-100'
                    : 'border-transparent hover:border-white/50 text-blue-100'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Search Icon & Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <button
                className="hidden md:block p-2 hover:bg-blue-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                title={t('nav.search')}
                onClick={() => setIsSearchOverlayOpen(true)}
                aria-label={t('nav.search')}
              >
                <Search size={20} />
              </button>
              <button
                className="md:hidden p-2 hover:bg-blue-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white z-50 relative"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? t('nav.menu.close') : t('nav.menu.open')}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Menu Content */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-lamar-navy border-t border-blue-800 shadow-2xl transition-all duration-300 ease-out origin-top z-50 ${isMobileMenuOpen
            ? 'opacity-100 scale-y-100 translate-y-0 visible'
            : 'opacity-0 scale-y-95 -translate-y-4 invisible'
            }`}
        >
          <div className="px-4 pt-6 pb-8 space-y-4">

            {/* Mobile Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder={t('nav.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMobileSearchSubmit()}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all text-base backdrop-blur-md"
              />
              <button
                onClick={handleMobileSearchSubmit}
                className="absolute left-4 top-3.5 text-blue-200 hover:text-white transition-colors"
                aria-label={t('nav.search')}
              >
                <Search size={20} />
              </button>
            </div>

            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPage === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`w-full flex justify-between items-center text-left px-4 py-4 text-base font-medium rounded-xl transition-all group focus:outline-none focus:ring-2 focus:ring-white/50 ${isActive
                      ? 'bg-white/20 text-white shadow-inner border border-white/10'
                      : 'text-blue-50 hover:bg-white/10 hover:text-white border border-transparent'
                      }`}
                  >
                    <span className={isActive ? 'font-bold' : ''}>{item.label}</span>
                    <ChevronRight
                      size={18}
                      className={`transition-transform ${isActive
                        ? 'text-white translate-x-1'
                        : 'text-blue-400 group-hover:text-white group-hover:translate-x-1'
                        }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-6 mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleNavClick('locations')}
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-blue-100 bg-blue-900/50 hover:bg-blue-800 rounded-lg transition-colors text-center focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {t('nav.atm')}
              </button>
              <button
                onClick={toggleLanguage}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-blue-100 bg-blue-900/50 hover:bg-blue-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <span>{t('nav.language')}</span>
                <span className="text-xs border border-blue-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{language === 'en' ? 'EN' : 'ES'}</span>
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="col-span-2 flex items-center justify-center px-4 py-3 text-sm font-medium text-blue-100 bg-blue-900/50 hover:bg-blue-800 rounded-lg transition-colors text-center focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {t('nav.support')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Intelligent Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => {
          setIsSearchOverlayOpen(false);
          setSearchQuery(''); // Reset mobile query when closing to prevent reuse
        }}
        initialQuery={searchQuery}
      />
    </>
  );
};
