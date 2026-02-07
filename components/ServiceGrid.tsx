import React from 'react';
import { 
  Landmark, 
  CreditCard, 
  Home, 
  Car, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { ServiceItem } from '../types';
import { useLanguage } from './LanguageContext';

interface ServiceGridProps {
  onNavigate: (page: string) => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const SERVICES: ServiceItem[] = [
    { label: t('service.grid.checking'), icon: CreditCard, href: '#', internalLink: 'personal#checking' },
    { label: t('service.grid.savings'), icon: Landmark, href: '#', internalLink: 'personal#checking' },
    { label: t('service.grid.homeLoans'), icon: Home, href: 'https://loans.lamarnational.com/s/login/?language=en_US&ec=302&startURL=%2Fs%2F' },
    { label: t('service.grid.autoLoans'), icon: Car, href: '#', internalLink: 'personal#lending' },
    { label: t('service.grid.business'), icon: Briefcase, href: '#', internalLink: 'business' },
    { label: t('service.grid.investing'), icon: TrendingUp, href: '#', internalLink: 'business#rates' },
    { label: t('service.grid.security'), icon: ShieldCheck, href: '#', internalLink: 'security' },
    { label: t('service.grid.mobile'), icon: Smartphone, href: '#', internalLink: 'personal#mobile' },
  ];

  const handleClick = (e: React.MouseEvent, item: ServiceItem) => {
    if (item.internalLink) {
      e.preventDefault();
      onNavigate(item.internalLink);
    }
  };

  return (
    <div className="relative z-30 -mt-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 md:p-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-4">
            {SERVICES.map((service) => (
              <a 
                key={service.label} 
                href={service.href}
                onClick={(e) => handleClick(e, service)}
                target={!service.internalLink ? "_blank" : undefined}
                rel={!service.internalLink ? "noopener noreferrer" : undefined}
                className="group flex flex-col items-center justify-center p-2 rounded-xl hover:bg-blue-50/50 transition-all duration-300 cursor-pointer"
              >
                <div className="bg-blue-50 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-lamar-blue group-hover:scale-110 group-hover:bg-lamar-blue group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 mb-2">
                  <service.icon size={24} strokeWidth={2} />
                </div>
                <span className="text-[10px] md:text-xs font-bold text-gray-600 group-hover:text-lamar-blue transition-colors text-center leading-tight">
                  {service.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
