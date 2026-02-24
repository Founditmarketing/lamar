import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Loader2, Volume2, MicOff } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { useLanguage } from './LanguageContext';

export const LiveAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silenceRef = useRef<GainNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  // Close session on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const connect = async () => {
    setError(null);
    try {
      // 1. Setup Audio Contexts
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const inputContext = new AudioContext({ sampleRate: 16000 });
      const outputContext = new AudioContext({ sampleRate: 24000 });

      // Ensure contexts are resumed (browser autoplay policy)
      await inputContext.resume();
      await outputContext.resume();

      inputAudioContextRef.current = inputContext;
      audioContextRef.current = outputContext;
      nextStartTimeRef.current = 0;

      // 2. Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Connect to Gemini Live
      // Initialize client here to ensure we use the potentially newly selected API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);

            // Setup Input Processing
            const source = inputContext.createMediaStreamSource(stream);
            sourceRef.current = source;

            const processor = inputContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            // Setup silence node to prevent feedback while keeping processor active
            const silence = inputContext.createGain();
            silence.gain.value = 0;
            silenceRef.current = silence;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            // Connect to silence, then to destination to keep graph alive without audio output
            processor.connect(silence);
            silence.connect(inputContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);

              // Simple volume visualizer hack - reset speaking after delay if no more chunks
              const timeoutId = setTimeout(() => setIsSpeaking(false), 2000); // Rough estimate

              if (outputContext) {
                const buffer = await decodeAudioData(
                  decode(base64Audio),
                  outputContext,
                  24000,
                  1
                );

                const source = outputContext.createBufferSource();
                source.buffer = buffer;
                source.connect(outputContext.destination);

                const currentTime = outputContext.currentTime;
                const startTime = Math.max(nextStartTimeRef.current, currentTime);

                source.start(startTime);
                nextStartTimeRef.current = startTime + buffer.duration;
              }
            }
          },
          onclose: () => {
            setIsConnected(false);
            setIsSpeaking(false);
          },
          onerror: (err) => {
            console.error('Gemini Live Error:', err);
            setError(t('live.error'));
            setIsConnected(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: 'You are a helpful, friendly banking assistant for Lamar National Bank. You help users navigate the website and answer general banking questions. Keep answers concise.',
        },
      });

    } catch (err) {
      console.error('Connection failed:', err);
      setError(t('live.error'));
    }
  };

  const disconnect = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (silenceRef.current) {
      silenceRef.current.disconnect();
      silenceRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setIsSpeaking(false);
  };

  const toggleSession = async () => {
    if (isOpen) {
      disconnect();
      setIsOpen(false);
    } else {
      // Check for API Key first to prevent Network Error
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        try {
          const hasKey = await aistudio.hasSelectedApiKey();
          if (!hasKey) {
            await aistudio.openSelectKey();
          }
        } catch (e) {
          console.error("API Key selection check failed", e);
        }
      }

      setIsOpen(true);
      connect();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggleSession}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 ${isOpen ? 'bg-blue-600 rotate-0' : 'bg-lamar-blue hover:bg-blue-700'
          }`}
        aria-label={t('live.btn.start')}
      >
        {isOpen ? <X className="text-white" size={28} /> : <Mic className="text-white" size={28} />}
      </button>

      {/* Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-40 overflow-hidden border border-gray-100 animate-slideUp">
          {/* Header */}
          <div className="bg-lamar-navy p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Volume2 className="text-white" size={16} />
            </div>
            <h3 className="text-white font-bold text-sm tracking-wide">{t('live.title')}</h3>
            <div className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isConnected ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
              {isConnected ? 'LIVE' : t('live.offline')}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 flex flex-col items-center justify-center min-h-[240px] bg-gradient-to-b from-gray-50 to-white relative">

            {error ? (
              <div className="text-center text-red-600 p-4">
                <p className="font-semibold mb-2">{error}</p>
                <p className="text-xs text-gray-500 mb-2">{t('live.console')}</p>
                <button onClick={connect} className="text-xs bg-red-100 px-3 py-1 rounded-full hover:bg-red-200">{t('live.retry')}</button>
              </div>
            ) : !isConnected ? (
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <Loader2 className="animate-spin text-lamar-blue" size={32} />
                <span className="text-sm font-medium">{t('live.status.connecting')}</span>
              </div>
            ) : (
              <div className="relative">
                {/* Visualizer Circle */}
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${isSpeaking ? 'bg-blue-100 scale-110' : 'bg-gray-100'}`}>
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-150 ${isSpeaking ? 'bg-blue-500 shadow-lg shadow-blue-500/50 scale-105' : 'bg-lamar-blue'}`}>
                    <Mic className="text-white w-10 h-10" />
                  </div>
                </div>

                {/* Ripple Rings Animation when Speaking */}
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-20 animate-ping"></div>
                    <div className="absolute -inset-4 rounded-full border-2 border-blue-300 opacity-10 animate-pulse"></div>
                  </>
                )}

                <p className="text-center mt-8 text-gray-600 font-medium animate-pulse">
                  {isSpeaking ? t('live.status.speaking') : t('live.status.listening')}
                </p>
              </div>
            )}

          </div>

          {/* Footer Disclaimer */}
          <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
            <p className="text-[10px] text-gray-400">{t('live.disclaimer')}</p>
          </div>
        </div>
      )}
    </>
  );
};

// --- Helper Functions from SDK Examples ---

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
