import React from 'react';
import { MapPin, Clock, Heart } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative py-24 bg-gray-900 flex items-center justify-center text-center px-4">
          <div className="absolute inset-0 opacity-40">
               <img src="https://images.unsplash.com/photo-1562519819-016930aa3154?q=80&w=2066&auto=format&fit=crop" alt="Historical Building" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('about.hero.title')}</h1>
              <p className="text-xl text-gray-300">
                  {t('about.hero.subtitle')}
              </p>
          </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Story Section */}
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('about.story.title')}</h2>
            <div className="prose prose-lg text-gray-600 mx-auto">
                <p className="mb-6">
                    {t('about.story.p1').split(': ').map((part, i, arr) => (
                        <React.Fragment key={i}>
                            {part}{i < arr.length - 1 && ': '}
                        </React.Fragment>
                    ))}
                    {/* The translation structure makes "Service comes first" part of the string, simple replacement is safer */}
                </p>
                <p>
                    {t('about.story.p2')}
                </p>
            </div>
        </section>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-lamar-blue text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('about.val.longevity.title')}</h3>
                <p className="text-sm text-gray-600">{t('about.val.longevity.desc')}</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-lamar-blue text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('about.val.community.title')}</h3>
                <p className="text-sm text-gray-600">{t('about.val.community.desc')}</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-lamar-blue text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('about.val.service.title')}</h3>
                <p className="text-sm text-gray-600">{t('about.val.service.desc')}</p>
            </div>
        </div>

        {/* Leadership Teaser */}
        <div className="bg-gray-100 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.lead.title')}</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                {t('about.lead.desc')}
            </p>
            <button className="bg-white border border-gray-300 text-gray-900 font-semibold py-2 px-6 rounded-full hover:bg-gray-50 transition-colors">
                {t('about.lead.btn')}
            </button>
        </div>

      </div>
    </div>
  );
};
