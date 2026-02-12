'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  'en': {
    // App Header
    'app.title': 'Health Assistant',
    'app.subtitle': 'Your AI-powered healthcare companion',
    
    // Mode Toggle
    'mode.guided': 'Guided',
    'mode.free': 'Free Chat',
    
    // Guided Assessment
    'assessment.start': 'Start Assessment',
    'assessment.starting': 'Starting...',
    'assessment.complete': 'Assessment Complete',
    'assessment.urgency': 'Urgency Level',
    'assessment.symptoms_summary': 'Symptoms Summary',
    'assessment.primary': 'Primary',
    'assessment.duration': 'Duration',
    'assessment.severity': 'Severity',
    'assessment.additional': 'Additional',
    'assessment.possible_conditions': 'Possible Conditions',
    'assessment.disclaimer': 'Important Disclaimer',
    'assessment.disclaimer_text': 'This assessment provides general information and is not a substitute for professional medical care. Always consult with a qualified healthcare provider for medical concerns, especially if symptoms are severe or worsening.',
    'assessment.new_assessment': 'Start New Assessment',
    
    // Assessment Steps
    'step.symptom.question': 'What symptom are you experiencing? Please describe it in detail.',
    'step.duration.question': 'How long have you been experiencing {symptom}?',
    'step.severity.question': 'On a scale of 1 to 10, how severe is your {symptom}? (1 = mild, 10 = very severe)',
    'step.additional.question': 'Are you experiencing any other symptoms? Please list them.',
    'step.history.question': 'Do you have any relevant medical history or pre-existing conditions?',
    
    // Examples
    'examples.symptom': 'headache, fever, cough, stomach pain, fatigue',
    'examples.duration': '2 days, since yesterday, about a week, just started',
    'examples.severity': 'mild, moderate, severe, 5 out of 10, 7 out of 10',
    'examples.additional': 'no, also have fever, nausea and fatigue, body aches',
    'examples.history': 'no, asthma, diabetes, high blood pressure, none relevant',
    
    // Free Chat
    'chat.welcome': 'Free Chat Mode',
    'chat.description': 'Describe your symptoms freely and I\'ll help you understand possible causes, precautions, and whether you should see a doctor.',
    'chat.placeholder': 'Tell me about your health concerns...',
    'chat.sending': 'Sending...',
    
    // Common
    'reset': 'Reset',
    'examples': 'Examples:',
    'type_response': 'Type your response here...',
    'disclaimer': '⚠️ This is not a substitute for professional medical advice',
    'footer.health': 'Your health is our priority',
    'footer.consult': 'Always consult with a qualified healthcare provider for medical concerns',
    
    // Voice Input
    'voice.start': 'Start speaking',
    'voice.listening': 'Listening...',
    'voice.processing': 'Processing...',
    'voice.error': 'Voice input not supported',
    'voice.allow': 'Please allow microphone access',
  },
  
  hi: {
    // App Header
    'app.title': 'स्वास्थ्य सहायक',
    'app.subtitle': 'आपका AI-संचालित स्वास्थ्य साथी',
    
    // Mode Toggle
    'mode.guided': 'मार्गदर्शित',
    'mode.free': 'मुक्त चैट',
    
    // Guided Assessment
    'assessment.start': 'मूल्यांकन शुरू करें',
    'assessment.starting': 'शुरू हो रहा है...',
    'assessment.complete': 'मूल्यांकन पूर्ण',
    'assessment.urgency': 'तात्कालिकता स्तर',
    'assessment.symptoms_summary': 'लक्षण सारांश',
    'assessment.primary': 'प्राथमिक',
    'assessment.duration': 'अवधि',
    'assessment.severity': 'गंभीरता',
    'assessment.additional': 'अतिरिक्त',
    'assessment.possible_conditions': 'संभावित स्थितियां',
    'assessment.disclaimer': 'महत्वपूर्ण अस्वीकरण',
    'assessment.disclaimer_text': 'यह मूल्यांकन सामान्य जानकारी प्रदान करता है और पेशेवर चिकित्सा देखभाल का विकल्प नहीं है। विशेष रूप से गंभीर या बिगड़ते लक्षणों के मामले में हमेशा योग्य स्वास्थ्य देखभाल प्रदाता से परामर्श करें।',
    'assessment.new_assessment': 'नया मूल्यांकन शुरू करें',
    
    // Assessment Steps
    'step.symptom.question': 'आप क्या लक्षण महसूस कर रहे हैं? कृपया विस्तार से बताएं।',
    'step.duration.question': 'आपको {symptom} कितने समय से हो रहा है?',
    'step.severity.question': '1 से 10 के पैमाने पर, आपका {symptom} कितना गंभीर है? (1 = कम, 10 = बहुत गंभीर)',
    'step.additional.question': 'क्या आपको कोई अन्य लक्षण हैं? कृपया उन्हें सूचीबद्ध करें।',
    'step.history.question': 'क्या आपके पास कोई प्रासंगिक चिकित्सा इतिहास या पहले से मौजूद स्थितियां हैं?',
    
    // Examples
    'examples.symptom': 'सिरदर्द, बुखार, खांसी, पेट दर्द, थकान',
    'examples.duration': '2 दिन, कल से, लगभग एक सप्ताह, अभी शुरू हुआ',
    'examples.severity': 'कम, मध्यम, गंभीर, 5 में से 5, 10 में से 7',
    'examples.additional': 'नहीं, बुखार भी है, मतली और थकान, शरीर दर्द',
    'examples.history': 'नहीं, अस्थमा, मधुमेह, उच्च रक्तचाप, कोई प्रासंगिक नहीं',
    
    // Free Chat
    'chat.welcome': 'मुक्त चैट मोड',
    'chat.description': 'अपने लक्षणों को स्वतंत्र रूप से बताएं और मैं आपको संभावित कारण, सावधानियां और यह जानने में मदद करूंगा कि क्या आपको डॉक्टर को दिखाना चाहिए।',
    'chat.placeholder': 'अपनी स्वास्थ्य चिंताएं बताएं...',
    'chat.sending': 'भेज रहा है...',
    
    // Common
    'reset': 'रीसेट',
    'examples': 'उदाहरण:',
    'type_response': 'यहां अपनी प्रतिक्रिया टाइप करें...',
    'disclaimer': '⚠️ यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है',
    'footer.health': 'आपका स्वास्थ्य हमारी प्राथमिकता है',
    'footer.consult': 'चिकित्सा संबंधी चिंताओं के लिए हमेशा योग्य स्वास्थ्य देखभाल प्रदाता से परामर्श करें',
    
    // Voice Input
    'voice.start': 'बोलना शुरू करें',
    'voice.listening': 'सुन रहा है...',
    'voice.processing': 'प्रोसेसिंग...',
    'voice.error': 'वॉइस इनपुट समर्थित नहीं है',
    'voice.allow': 'कृपया माइक्रोफोन एक्सेस की अनुमति दें',
  },
  
  mr: {
    // App Header
    'app.title': 'आरोग्य सहायक',
    'app.subtitle': 'आपला AI-चालित आरोग्य सोबती',
    
    // Mode Toggle
    'mode.guided': 'मार्गदर्शित',
    'mode.free': 'मुक्त चॅट',
    
    // Guided Assessment
    'assessment.start': 'मूल्यांकन सुरू करा',
    'assessment.starting': 'सुरू होत आहे...',
    'assessment.complete': 'मूल्यांकन पूर्ण',
    'assessment.urgency': 'तात्काळता स्तर',
    'assessment.symptoms_summary': 'लक्षणे सारांश',
    'assessment.primary': 'प्राथमिक',
    'assessment.duration': 'कालावधी',
    'assessment.severity': 'गंभीरता',
    'assessment.additional': 'अतिरिक्त',
    'assessment.possible_conditions': 'शक्य स्थिती',
    'assessment.disclaimer': 'महत्त्वाची अस्वीकरण',
    'assessment.disclaimer_text': 'हे मूल्यांकन सामान्य माहिती प्रदान करते आणि व्यावसायिक वैद्यकीय देखभालीचा पर्याय नाही. विशेषतः गंभीर किंवा वाढणारी लक्षणे असल्यास नेहमी पात्र आरोग्य देखभाल प्रदात्यांशी सल्ला करा.',
    'assessment.new_assessment': 'नवीन मूल्यांकन सुरू करा',
    
    // Assessment Steps
    'step.symptom.question': 'आपल्याला कोणते लक्षण जाणवत आहे? कृपया तपशीलने सांगा.',
    'step.duration.question': 'आपल्याला {symptom} किती काळापासून आहे?',
    'step.severity.question': '1 ते 10 च्या स्केलवर, आपले {symptom} किती गंभीर आहे? (1 = कमी, 10 = खूप गंभीर)',
    'step.additional.question': 'आपल्याला इतर कोणतीही लक्षणे आहेत का? कृपया त्यांची यादी करा.',
    'step.history.question': 'आपल्याजवळ कोणतीही संबंधित वैद्यकीय इतिहास किंवा अस्तित्वात असलेल्या स्थिती आहेत का?',
    
    // Examples
    'examples.symptom': 'डोकेदुखी, ताप, खोकली, पोटदुखी, थकवा',
    'examples.duration': '2 दिवस, उद्यापासून, सुमारे एक आठवडा, आत्ता सुरू झाले',
    'examples.severity': 'कमी, मध्यम, गंभीर, 5 मधील 5, 10 मधील 7',
    'examples.additional': 'नाही, ताप सुद्धा आहे, मळमळ आणि थकवा, शरीर दुखी',
    'examples.history': 'नाही, दमा, मधुमेह, उच्च रक्तदाब, कोणतेही संबंधित नाही',
    
    // Free Chat
    'chat.welcome': 'मुक्त चॅट मोड',
    'chat.description': 'आपली लक्षणे स्वतंत्रपणे सांगा आणि मी आपल्याला संभाव्य कारणे, खबरदारी आणि आपल्याला डॉक्टरांकडे जावे की नाही हे समजून घेण्यास मदत करेन.',
    'chat.placeholder': 'आपल्या आरोग्याच्या चिंता सांगा...',
    'chat.sending': 'पाठवत आहे...',
    
    // Common
    'reset': 'रीसेट',
    'examples': 'उदाहरणे:',
    'type_response': 'येथे आपली प्रतिक्रिया टाइप करा...',
    'disclaimer': '⚠️ हे व्यावसायिक वैद्यकीय सल्ल्याचा पर्याय नाही',
    'footer.health': 'आपले आरोग्य आमची प्राथमिकता आहे',
    'footer.consult': 'वैद्यकीय चिंता आणि गोष्टींसाठी नेहमी पात्र आरोग्य देखभाल प्रदात्यांशी सल्ला करा',
    
    // Voice Input
    'voice.start': 'बोलणे सुरू करा',
    'voice.listening': 'ऐकत आहे...',
    'voice.processing': 'प्रक्रिया करत आहे...',
    'voice.error': 'व्हॉइस इनपुट समर्थित नाही',
    'voice.allow': 'कृपया मायक्रोफोन प्रवेशाची परवानगी द्या',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && ['en', 'hi', 'mr'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const translate = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found anywhere
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const isRTL = false; // All supported languages are LTR

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translate,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
