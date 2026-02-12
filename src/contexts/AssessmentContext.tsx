'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AssessmentStep {
  step: string;
  question: string;
  type: string;
  examples?: string[];
}

interface AssessmentSession {
  session_id: string;
  current_step: string;
  primary_symptom?: string;
  duration?: string;
  severity?: string;
  additional_symptoms: string[];
  is_complete: boolean;
}

interface AssessmentContextType {
  session: AssessmentSession | null;
  currentQuestion: AssessmentStep | null;
  isLoading: boolean;
  error: string | null;
  startAssessment: () => Promise<void>;
  submitResponse: (response: string) => Promise<void>;
  resetAssessment: () => Promise<void>;
  assessmentSummary: any;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

interface AssessmentProviderProps {
  children: ReactNode;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ children }) => {
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentStep | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessmentSummary, setAssessmentSummary] = useState<any>(null);

  const startAssessment = async () => {
    setIsLoading(true);
    setError(null);
    setAssessmentSummary(null);
    
    try {
      const response = await fetch('http://localhost:8000/assessment/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start assessment');
      }

      const data = await response.json();
      
      setSession({
        session_id: data.session_id,
        current_step: data.step,
        additional_symptoms: [],
        is_complete: data.is_complete,
      });
      
      setCurrentQuestion({
        step: data.step,
        question: data.question,
        type: data.type,
        examples: data.examples,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const submitResponse = async (response: string) => {
    if (!session) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('http://localhost:8000/assessment/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: session.session_id,
          response: response,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit response');
      }

      const data = await res.json();
      
      if (data.is_complete) {
        // Assessment is complete
        setSession(prev => prev ? { ...prev, is_complete: true } : null);
        setAssessmentSummary(data.assessment);
        setCurrentQuestion(null);
      } else {
        // Continue with next question
        setSession(prev => prev ? { ...prev, current_step: data.step } : null);
        setCurrentQuestion({
          step: data.step,
          question: data.question,
          type: data.type,
          examples: data.examples,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAssessment = async () => {
    setIsLoading(true);
    setError(null);
    setAssessmentSummary(null);
    
    try {
      await startAssessment();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset assessment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AssessmentContext.Provider
      value={{
        session,
        currentQuestion,
        isLoading,
        error,
        startAssessment,
        submitResponse,
        resetAssessment,
        assessmentSummary,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
