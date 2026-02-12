'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  theme?: 'light' | 'dark';
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscript, 
  disabled = false,
  theme = 'light'
}) => {
  const { translate, language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Check for browser support only on client side
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      
      // Set language based on selected language
      const languageMap = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'mr': 'mr-IN'
      };
      recognitionRef.current.lang = languageMap[language] || 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsProcessing(true);
        
        // Small delay to show processing state
        setTimeout(() => {
          onTranscript(transcript);
          setIsProcessing(false);
          setIsListening(false);
        }, 500);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(translate('voice.error'));
        setIsListening(false);
        setIsProcessing(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
      };

      setIsSupported(true);
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTranscript, translate]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError(translate('voice.error'));
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Request microphone permission
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          recognitionRef.current.start();
        })
        .catch(() => {
          setError(translate('voice.allow'));
        });
    }
  };

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="p-2 rounded-lg">
        <div className="w-4 h-4"></div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <button
        disabled
        className="p-2 rounded-lg opacity-50 cursor-not-allowed"
        title={translate('voice.error')}
      >
        <MicOff className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        disabled={disabled || isListening || isProcessing}
        className={`p-2 rounded-lg transition-all duration-200 ${
          disabled || isListening || isProcessing
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title={isListening ? translate('voice.listening') : translate('voice.start')}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isListening ? (
          <Mic className="w-4 h-4 text-red-500 animate-pulse" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {/* Status indicator */}
      {(isListening || isProcessing || error) && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 rounded-lg text-xs whitespace-nowrap z-50"
          style={{
            backgroundColor: error 
              ? (theme === 'light' ? '#fef2f2' : '#7f1d1d')
              : (theme === 'light' ? '#f0f9ff' : '#1e3a8a'),
            color: error 
              ? (theme === 'light' ? '#dc2626' : '#fca5a5')
              : (theme === 'light' ? '#2563eb' : '#60a5fa')
          }}
        >
          {error || (isListening ? translate('voice.listening') : translate('voice.processing'))}
        </div>
      )}

      {/* Visual feedback for listening */}
      {isListening && (
        <div className="absolute inset-0 rounded-lg border-2 border-red-500 animate-pulse"></div>
      )}
    </div>
  );
};
