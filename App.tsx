import React, { useState, useEffect } from 'react';
import ReactLenis from 'lenis/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServiceGrid } from './components/ServiceGrid';
import { PersonalPage } from './components/PersonalPage';
import { BusinessPage } from './components/BusinessPage';
import { AboutPage } from './components/AboutPage';
import { ResourcesPage } from './components/ResourcesPage';
import { EducationPage } from './components/EducationPage';
import { CompareAccountsPage } from './components/CompareAccountsPage';
import { LocationsPage } from './components/LocationsPage';
import { SecurityPage } from './components/SecurityPage';
import { CardDesigner } from './components/CardDesigner';
import { Footer } from './components/Footer';
import { LiveAssistant } from './components/LiveAssistant';
import { PlaceholderPage } from './components/PlaceholderPage';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { JSONLD } from './components/JSONLD';
import { ArrowRight, Smartphone, Home as HomeIcon, Briefcase } from 'lucide-react';
import { FeatureCard } from './components/ui/FeatureCard';
import { PasswordProtection } from './components/PasswordProtection';

// The main layout component that has access to the language context
const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { t } = useLanguage();

  const handleNavClick = (page: string) => {
    const [targetPage, hash] = page.split('#');
    setCurrentPage(targetPage);

    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  };

  // Expose navigation globally for simple components deep in the tree
  useEffect(() => {
    (window as any).appNavigate = handleNavClick;
  }, []);

  // Dynamic Page Titles
  useEffect(() => {
    const getPageTitle = () => {
      switch (currentPage) {
        case 'personal': return t('nav.personal');
        case 'business': return t('nav.business');
        case 'resources': return t('nav.resources');
        case 'about': return t('nav.about');
        case 'compare-accounts': return t('compare.title');
        case 'card-design': return 'Design Your Card';
        case 'locations': return t('loc.title');
        case 'security': return t('sec.title');
        case 'education': return t('edu.title');
        case 'home':
        default:
          return 'Home';
      }
    };

    const title = getPageTitle();
    document.title = `${title} | Lamar National Bank`;
  }, [currentPage, t]);

  const renderContent = () => {
    switch (currentPage) {
      case 'personal':
        return <PersonalPage onNavigate={handleNavClick} />;
      case 'compare-accounts':
        return <CompareAccountsPage />;
      case 'card-design':
        return <CardDesigner />;
      case 'business':
        return <BusinessPage />;
      case 'about':
        return <AboutPage onNavigate={handleNavClick} />;
      case 'resources':
        return <ResourcesPage />;
      case 'education':
        return <EducationPage />;
      case 'locations':
        return <LocationsPage />;
      case 'security':
        return <SecurityPage />;
      case 'contact':
        return <PlaceholderPage title="Contact Us" />;
      case 'careers':
        return <PlaceholderPage title="Careers" />;
      case 'news':
        return <PlaceholderPage title="News & Press" />;
      case 'investor':
        return <PlaceholderPage title="Investor Relations" />;
      case 'community':
        return <PlaceholderPage title="Community" />;
      case 'privacy':
        return <PlaceholderPage title="Privacy Policy" />;
      case 'disclosures':
        return <PlaceholderPage title="Disclosures" />;
      case 'accessibility':
        return <PlaceholderPage title="Accessibility" />;
      case 'lost-card':
        return <PlaceholderPage title="Lost or Stolen Card" />;
      case 'home':
      default:
        return (
          <>
            <Hero onNavigate={handleNavClick} />
            <ServiceGrid onNavigate={handleNavClick} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">{t('home.wellness')}</h2>
                <div className="h-1 w-20 bg-lamar-red mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Feature Card 1: Mobile */}
                <FeatureCard
                  title={t('home.balance.title')}
                  description={t('home.balance.desc')}
                  image="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
                  icon={Smartphone}
                  onClick={() => handleNavClick('personal#mobile')}
                  delay="0s"
                />

                {/* Feature Card 2: Refinance */}
                <FeatureCard
                  title={t('home.refinance.title')}
                  description={t('home.refinance.desc')}
                  image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
                  icon={HomeIcon}
                  onClick={() => window.open('https://loans.lamarnational.com/s/login/?language=en_US&ec=302&startURL=%2Fs%2F', '_blank')}
                  delay="0.1s"
                />

                {/* Feature Card 3: Business */}
                <FeatureCard
                  title={t('home.biz.title')}
                  description={t('home.biz.desc')}
                  image="https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=800"
                  icon={Briefcase}
                  onClick={() => handleNavClick('business')}
                  delay="0.2s"
                />

              </div>
            </div>

            {/* Local Impact & Community Q&A Section */}
            <div className="bg-gray-50 py-24 border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div>
                    <h2 className="text-3xl font-bold text-lamar-navy mb-6">{t('seo.content.title')}</h2>
                    <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                      <p>{t('seo.content.p1')}</p>
                      <p>{t('seo.content.p2')}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-lamar-navy mb-4">Common Questions in Our Communities</h3>
                    <div className="space-y-4">
                      {[4, 5, 6].map((num) => (
                        <div key={num} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                          <h4 className="font-bold text-lamar-blue mb-2">{t(`faq.q${num}`)}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{t(`faq.a${num}`)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <ReactLenis root>
      <div className="min-h-screen flex flex-col font-sans bg-gray-50 selection:bg-lamar-blue selection:text-white">
        <Header onNavigate={handleNavClick} currentPage={currentPage} />
        <main className="flex-grow">
          {renderContent()}
        </main>
        <Footer onNavigate={handleNavClick} />
        <JSONLD />
        <LiveAssistant />
      </div>
    </ReactLenis>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <PasswordProtection>
        <AppContent />
      </PasswordProtection>
    </LanguageProvider>
  );
};

export default App;