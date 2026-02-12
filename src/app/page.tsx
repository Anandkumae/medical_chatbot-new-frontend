'use client';

import { useState } from 'react';
import { Send, Heart, Stethoscope, MessageCircle, Sun, Moon, Activity } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { GuidedAssessment } from '@/components/GuidedAssessment';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { VoiceInput } from '@/components/VoiceInput';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

function MedicalChatbotContent() {
  const { theme: contextTheme } = useTheme();
  const { language, translate } = useLanguage();
  const [mode, setMode] = useState<'free' | 'guided'>('guided'); // Default to guided
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Local theme state for this component (since ThemeContext doesn't expose setTheme)
  const [theme, setTheme] = useState<'light' | 'dark'>(contextTheme);

  // Simple theme toggle
  const toggleTheme = () => {
    setTheme((prev: 'light' | 'dark') => prev === 'light' ? 'dark' : 'light');
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          language: language 
        }),
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.choices?.[0]?.message?.content || data.error || 'Sorry, I could not process your request.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Error connecting to the server. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text: string) => {
    // Format the message for better medical information structure
    return text
      // Remove any remaining markdown bold markers
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      
      // Convert medical section headers to bold with proper spacing
      .replace(/(symptoms|causes|precautions|treatment|recommendations|diagnosis|risk factors|prevention|when to see a doctor|medical advice|home remedies|lifestyle changes|complications|prognosis|outlook):/gi, 
        '\n\n<strong>$1:</strong>')
      
      // Convert numbered lists to proper format
      .replace(/(\d+\.\s+)/g, '\n$1')
      
      // Convert bullet points to proper format
      .replace(/[-*]\s+/g, '• ')
      
      // Bold important medical terms
      .replace(/\b(emergency|urgent|immediate|severe|mild|moderate|chronic|acute)\b/gi, '<strong>$1</strong>')
      
      // Format time-related terms
      .replace(/(\d+\s+(?:days?|weeks?|months?|years?|hours?))/gi, '<strong>$1</strong>')
      
      // Format medical conditions
      .replace(/\b(fever|headache|cough|cold|flu|infection|inflammation|pain|nausea|vomiting|diarrhea|fatigue|weakness|dizziness|shortness of breath|chest pain|abdominal pain)\b/gi, '<strong>$1</strong>')
      
      // Add proper line breaks for paragraphs
      .replace(/\n\s*\n/g, '\n\n')
      
      // Clean up excessive spacing
      .replace(/\s{3,}/g, ' ')
      
      // Ensure proper spacing around bold text
      .replace(/<\/strong>\s*([^\n])/g, '</strong> $1')
      .replace(/([^\n])\s*<strong>/g, '$1 <strong>')
      
      .trim();
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{
        background: theme === 'light' 
          ? 'linear-gradient(to bottom right, #dbeafe, #ffffff)' 
          : 'linear-gradient(to bottom right, #111827, #1f2937)'
      }}
    >
      {/* Header */}
      <header 
        className="shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
          borderBottomColor: theme === 'light' ? '#dbeafe' : '#374151'
        }}
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div 
                className="p-1.5 sm:p-2 rounded-lg transition-colors duration-300"
                style={{
                  backgroundColor: theme === 'light' ? '#2563eb' : '#1d4ed8'
                }}
              >
                <Stethoscope className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 
                  className="text-lg sm:text-xl font-semibold transition-colors duration-300"
                  style={{
                    color: theme === 'light' ? '#111827' : '#f9fafb'
                  }}
                >
                  {translate('app.title')}
                </h1>
                <p 
                  className="text-xs sm:text-sm transition-colors duration-300"
                  style={{
                    color: theme === 'light' ? '#6b7280' : '#9ca3af'
                  }}
                >
                  {translate('app.subtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* Mode Toggle */}
              <div 
                className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1"
                style={{
                  backgroundColor: theme === 'light' ? '#f3f4f6' : '#374151'
                }}
              >
                <button
                  onClick={() => setMode('guided')}
                  className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    mode === 'guided' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{translate('mode.guided')}</span>
                </button>
                <button
                  onClick={() => setMode('free')}
                  className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    mode === 'free' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{translate('mode.free')}</span>
                </button>
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 ease-in-out group"
                style={{
                  backgroundColor: theme === 'light' ? '#f3f4f6' : '#1f2937',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'light' ? '#e5e7eb' : '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'light' ? '#f3f4f6' : '#1f2937';
                }}
                aria-label="Toggle theme"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                  <Sun 
                    className={`absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 text-amber-600 transition-all duration-200 ${
                      theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
                    }`} 
                  />
                  <Moon 
                    className={`absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 text-blue-600 transition-all duration-200 ${
                      theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                    }`} 
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div 
          className="rounded-xl sm:rounded-2xl shadow-lg h-[500px] sm:h-[600px] flex flex-col transition-colors duration-300"
          style={{
            backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
            border: `1px solid ${theme === 'light' ? '#dbeafe' : '#374151'}`
          }}
        >
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-colors duration-300"
                  style={{
                    backgroundColor: theme === 'light' ? '#dbeafe' : '#1e3a8a'
                  }}
                >
                  <MessageCircle 
                    className="w-6 h-6 sm:w-8 sm:h-8" 
                    style={{
                      color: theme === 'light' ? '#2563eb' : '#60a5fa'
                    }}
                  />
                </div>
                <h2 
                  className="text-base sm:text-lg font-medium mb-2 transition-colors duration-300"
                  style={{
                    color: theme === 'light' ? '#111827' : '#f9fafb'
                  }}
                >
                  Welcome to Medical Assistant
                </h2>
                <p 
                  className="text-sm sm:text-base max-w-md mx-auto transition-colors duration-300"
                  style={{
                    color: theme === 'light' ? '#6b7280' : '#9ca3af'
                  }}
                >
                  Describe your symptoms and I'll help you understand possible causes, precautions, and whether you should see a doctor.
                </p>
                <div className="mt-4 sm:mt-6 text-xs sm:text-sm" style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>
                  <p>⚠️ This is not a substitute for professional medical advice</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[85%] sm:max-w-[70%] rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 transition-colors duration-300"
                    style={{
                      backgroundColor: message.sender === 'user' 
                        ? '#2563eb' 
                        : theme === 'light' ? '#f3f4f6' : '#374151',
                      color: message.sender === 'user' 
                        ? '#ffffff' 
                        : theme === 'light' ? '#111827' : '#f9fafb'
                    }}
                  >
                    <div 
                      className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                    />
                    <p 
                      className="text-xs mt-2 transition-colors duration-300"
                      style={{
                        color: message.sender === 'user' 
                          ? '#dbeafe' 
                          : theme === 'light' ? '#6b7280' : '#9ca3af'
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div 
                  className="rounded-2xl px-4 py-3 transition-colors duration-300"
                  style={{
                    backgroundColor: theme === 'light' ? '#f3f4f6' : '#374151'
                  }}
                >
                  <div className="flex space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: theme === 'light' ? '#9ca3af' : '#6b7280'
                      }}
                    ></div>
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: theme === 'light' ? '#9ca3af' : '#6b7280',
                        animationDelay: '0.1s'
                      }}
                    ></div>
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: theme === 'light' ? '#9ca3af' : '#6b7280',
                        animationDelay: '0.2s'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div 
            className="p-3 sm:p-4 transition-colors duration-300"
            style={{
              borderTop: `1px solid ${theme === 'light' ? '#e5e7eb' : '#4b5563'}`
            }}
          >
            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={translate('chat.placeholder')}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 text-sm sm:text-base"
                style={{
                  border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
                  backgroundColor: theme === 'light' ? '#ffffff' : '#374151',
                  color: theme === 'light' ? '#111827' : '#f9fafb'
                }}
                disabled={isLoading}
              />
              <VoiceInput 
                onTranscript={handleVoiceTranscript}
                disabled={isLoading}
                theme={theme}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && input.trim()) {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-center">
          <div 
            className="flex items-center justify-center gap-2 text-xs sm:text-sm transition-colors duration-300"
            style={{
              color: theme === 'light' ? '#6b7280' : '#9ca3af'
            }}
          >
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
            <p className="text-xs sm:text-base">Your health is our priority</p>
          </div>
          <p 
            className="text-xs mt-1 sm:mt-2 transition-colors duration-300"
            style={{
              color: theme === 'light' ? '#6b7280' : '#9ca3af'
            }}
          >
            Always consult with a qualified healthcare provider for medical concerns
          </p>
        </div>
      </main>
    </div>
  );
}

export default function MedicalChatbot() {
  return (
    <LanguageProvider>
      <MedicalChatbotContent />
    </LanguageProvider>
  );
}
