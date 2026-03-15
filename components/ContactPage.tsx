import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { GetStartedForm } from './GetStartedForm';
import { useLanguage } from './LanguageContext';

export const ContactPage: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="bg-gray-50 pb-20">
            {/* Minimal Background Header */}
            <div className="bg-lamar-navy text-white py-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Contact Lamar National Bank</h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                        We're here to help you achieve your financial goals. Reach out to our local team today.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-lamar-navy h-full">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ways to Connect</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 p-3 rounded-full text-lamar-navy shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Main Phone</p>
                                        <a href="tel:903-785-0701" className="text-lg text-lamar-navy hover:underline font-medium">903-785-0701</a>
                                        <p className="text-sm text-gray-500 mt-1">Available during business hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 border-t border-gray-100 pt-6">
                                    <div className="bg-blue-50 p-3 rounded-full text-lamar-navy shrink-0">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Email</p>
                                        <p className="text-sm text-gray-600">Please use the secure form to email our team directly.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 border-t border-gray-100 pt-6">
                                    <div className="bg-blue-50 p-3 rounded-full text-lamar-navy shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Headquarters</p>
                                        <p className="text-base text-gray-800">200 S Collegiate Dr.</p>
                                        <p className="text-base text-gray-800 mb-2">Paris, TX 75460</p>
                                        <a href="/#locations" className="text-sm font-bold text-blue-600 hover:text-lamar-navy hover:underline">View all branches &rarr;</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Lead Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <GetStartedForm />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
