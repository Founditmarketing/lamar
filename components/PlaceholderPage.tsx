import React from 'react';
import { Construction } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface PlaceholderPageProps {
    title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
    const { t } = useLanguage();

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50 animate-fade-in">
            <div className="w-20 h-20 bg-lamar-blue/10 rounded-full flex items-center justify-center mb-6">
                <Construction size={40} className="text-lamar-blue" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-lamar-navy mb-4">
                {title}
            </h1>
            <p className="text-xl text-gray-500 max-w-lg mb-8">
                We're currently building a World-Class experience for this page. Check back soon.
            </p>
            <div className="h-1 w-20 bg-lamar-gold rounded-full"></div>
        </div>
    );
};
