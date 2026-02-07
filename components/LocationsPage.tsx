import React, { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, Search, Filter, Sparkles, Map, Loader2, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from './LanguageContext';

interface Location {
  id: string;
  nameKey: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  lobbyHours: string;
  driveThruHours?: string;
  features: string[];
  coords: { lat: number; lng: number };
}

interface MapSource {
    uri: string;
    title: string;
}

export const LocationsPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeLocationId, setActiveLocationId] = useState<string>('paris');
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [mapSources, setMapSources] = useState<MapSource[]>([]);

  const locations: Location[] = [
    {
      id: 'paris',
      nameKey: 'loc.paris',
      address: '200 S. Collegiate Dr',
      city: 'Paris, TX',
      zip: '75460',
      phone: '903-785-0701',
      lobbyHours: '9:00 AM - 4:00 PM',
      driveThruHours: '8:00 AM - 6:00 PM',
      features: ['ATM', 'Lobby', 'Drive-Thru', 'Safe Deposit'],
      coords: { lat: 33.6609, lng: -95.5555 }
    },
    {
      id: 'reno',
      nameKey: 'loc.reno',
      address: '6250 Lamar Rd',
      city: 'Reno, TX',
      zip: '75462',
      phone: '903-785-0701',
      lobbyHours: '9:00 AM - 4:00 PM',
      driveThruHours: '8:00 AM - 6:00 PM',
      features: ['ATM', 'Drive-Thru'],
      coords: { lat: 33.6609, lng: -95.5555 }
    },
    {
      id: 'celina',
      nameKey: 'loc.celina',
      address: '110 S. Preston Rd',
      city: 'Celina, TX',
      zip: '75009',
      phone: '972-382-2300',
      lobbyHours: '9:00 AM - 4:00 PM',
      features: ['ATM', 'Lobby'],
      coords: { lat: 33.3238, lng: -96.7845 }
    },
    {
      id: 'ftworth',
      nameKey: 'loc.ftworth',
      address: '4500 Heritage Trace Pkwy',
      city: 'Fort Worth, TX',
      zip: '76244',
      phone: '817-232-2300',
      lobbyHours: '9:00 AM - 5:00 PM',
      features: ['Lobby', 'Commercial Lending'],
      coords: { lat: 32.9080, lng: -97.3000 }
    },
    {
        id: 'frisco',
        nameKey: 'loc.frisco',
        address: '2600 Network Blvd',
        city: 'Frisco, TX',
        zip: '75034',
        phone: '972-382-2300',
        lobbyHours: 'By Appointment',
        features: ['LPO', 'Commercial Lending'],
        coords: { lat: 33.1507, lng: -96.8236 }
    },
    {
        id: 'plano',
        nameKey: 'loc.plano',
        address: '5900 S. Lake Forest Dr',
        city: 'Plano, TX',
        zip: '75024',
        phone: '972-382-2300',
        lobbyHours: 'By Appointment',
        features: ['LPO', 'Commercial Lending'],
        coords: { lat: 33.0198, lng: -96.6989 }
    },
    {
      id: 'bryan',
      nameKey: 'loc.bryan',
      address: '4001 E 29th St',
      city: 'Bryan, TX',
      zip: '77802',
      phone: '979-776-7777',
      lobbyHours: '9:00 AM - 4:00 PM',
      features: ['LPO', 'Commercial Lending'],
      coords: { lat: 30.6744, lng: -96.3700 }
    }
  ];

  const activeLocation = locations.find(l => l.id === activeLocationId) || locations[0];

  const handleDirections = (loc: Location) => {
      const query = encodeURIComponent(`${loc.address}, ${loc.city} ${loc.zip}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleCall = (phone: string) => {
      window.open(`tel:${phone.replace(/[^0-9]/g, '')}`, '_self');
  };
  
  const getFeatureLabel = (feature: string) => {
      const key = `loc.feat.${feature.toLowerCase().replace(/ /g, '').replace('-', '')}`;
      return t(key);
  };
  
  const getHoursLabel = (hours: string) => {
      if (hours === 'By Appointment') return t('loc.appt');
      return hours;
  };

  const handleAiSearch = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse(null);
    setMapSources([]);

    try {
        let lat = 33.6609; // Default Paris, TX
        let lng = -95.5555;

        // Try to get real location
        try {
            const pos: GeolocationPosition = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
        } catch (e) {
            console.log("Using default location");
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        // Use gemini-2.5-flash for Maps Grounding
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: aiQuery,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: lat,
                            longitude: lng
                        }
                    }
                }
            },
        });

        setAiResponse(response.text || '');

        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
            // Extract map sources.
            const extracted = chunks
                .map((chunk: any) => {
                    // Check for direct maps object
                    if (chunk.maps?.uri) {
                        return { uri: chunk.maps.uri, title: chunk.maps.title || 'Google Maps Location' };
                    }
                    // Fallback to web if maps not explicit but uri exists
                    if (chunk.web?.uri && chunk.web.uri.includes('google.com/maps')) {
                        return { uri: chunk.web.uri, title: chunk.web.title || 'Map Location' };
                    }
                    return null;
                })
                .filter((item: any) => item !== null) as MapSource[];
            
            setMapSources(extracted);
        }

    } catch (err) {
        console.error(err);
        setAiResponse("I'm sorry, I couldn't connect to Google Maps right now.");
    } finally {
        setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Top Search Bar */}
      <div className="bg-lamar-blue p-4 shadow-md z-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            <h1 className="text-white font-bold text-xl md:mr-8 whitespace-nowrap">{t('loc.title')}</h1>
            
            {/* Standard Search (Hidden on mobile if desired, kept for consistency) */}
            <div className="relative flex-grow w-full md:w-auto hidden md:block">
                <input 
                    type="text" 
                    placeholder={t('loc.search.placeholder')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            
            <button className="hidden md:flex items-center gap-2 bg-white/10 text-white px-4 py-2.5 rounded-lg hover:bg-white/20 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white">
                <Filter size={18} />
                <span>{t('loc.filter')}</span>
            </button>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden flex-col md:flex-row">
          
          {/* List View */}
          <div className="w-full md:w-1/3 lg:w-[400px] bg-white overflow-y-auto border-r border-gray-200 flex-shrink-0">
              
              {/* Intelligent AI Search Input */}
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                  <label className="text-xs font-bold text-lamar-blue uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Sparkles size={12} /> {t('loc.smart')}
                  </label>
                  <div className="relative">
                      <textarea
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        placeholder={t('loc.ai.placeholder')}
                        className="w-full pl-3 pr-10 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-lamar-blue focus:border-transparent resize-none h-20"
                      />
                      <button 
                        onClick={handleAiSearch}
                        disabled={aiLoading || !aiQuery}
                        className="absolute bottom-2 right-2 bg-lamar-blue text-white p-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-lamar-blue"
                      >
                          {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Map size={16} />}
                      </button>
                  </div>
              </div>

              {/* AI Results */}
              {aiResponse && (
                  <div className="p-4 bg-blue-50 border-b border-blue-100 animate-fadeIn">
                      <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <Sparkles size={14} className="text-lamar-blue" /> {t('loc.ai.results')}
                      </h4>
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed whitespace-pre-wrap">
                          {aiResponse}
                      </p>
                      {mapSources.length > 0 && (
                          <div className="space-y-2">
                              {mapSources.map((source, idx) => (
                                  <a 
                                    key={idx} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs font-medium text-lamar-blue hover:underline bg-white p-2 rounded border border-blue-100 focus:outline-none focus:ring-2 focus:ring-lamar-blue"
                                  >
                                      <ExternalLink size={12} /> {source.title}
                                  </a>
                              ))}
                          </div>
                      )}
                      <p className="text-[10px] text-gray-400 mt-2 text-right">{t('loc.ai.disclaimer')}</p>
                  </div>
              )}

              {/* Static List */}
              <div className="p-2">
                  <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {t('loc.list.header')}
                  </div>
                  {locations.map((loc) => (
                      <button 
                        key={loc.id}
                        onClick={() => setActiveLocationId(loc.id)}
                        className={`w-full text-left p-5 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors focus:outline-none focus:bg-blue-50 focus:ring-2 focus:ring-inset focus:ring-lamar-blue ${activeLocationId === loc.id ? 'bg-blue-50 border-l-4 border-l-lamar-blue' : ''}`}
                        aria-pressed={activeLocationId === loc.id}
                      >
                          <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-gray-900 text-lg">{t(loc.nameKey)}</h3>
                              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{Number(loc.address.split(' ')[0]) / 100} mi</span>
                          </div>
                          
                          <p className="text-gray-600 mb-2">{loc.address}, {loc.city} {loc.zip}</p>
                          
                          <div className="space-y-1 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock size={14} className="text-lamar-blue" />
                                  <span className="font-medium">{t('loc.hours.lobby')}:</span>
                                  <span>{getHoursLabel(loc.lobbyHours)}</span>
                              </div>
                              {loc.driveThruHours && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock size={14} className="text-lamar-red" />
                                    <span className="font-medium">{t('loc.hours.drive')}:</span>
                                    <span>{getHoursLabel(loc.driveThruHours)}</span>
                                </div>
                              )}
                          </div>

                          <div className="flex gap-2 flex-wrap mb-4">
                              {loc.features.map(f => (
                                  <span key={f} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">{getFeatureLabel(f)}</span>
                              ))}
                          </div>

                          <div className="flex gap-3">
                               <div 
                                  onClick={(e) => { e.stopPropagation(); handleCall(loc.phone); }}
                                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-lamar-blue text-lamar-blue py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleCall(loc.phone); }}
                               >
                                    <Phone size={16} /> {t('loc.call')}
                               </div>
                               <div 
                                  onClick={(e) => { e.stopPropagation(); handleDirections(loc); }}
                                  className="flex-1 flex items-center justify-center gap-2 bg-lamar-blue text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleDirections(loc); }}
                               >
                                    <Navigation size={16} /> {t('loc.directions')}
                               </div>
                          </div>
                      </button>
                  ))}
              </div>
          </div>

          {/* Dynamic Map Embed */}
          <div className="flex-grow bg-gray-200 relative h-full min-h-[400px]">
               <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${activeLocation.address}, ${activeLocation.city} ${activeLocation.zip}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                title={t(activeLocation.nameKey)}
               ></iframe>
          </div>
      </div>
    </div>
  );
};
