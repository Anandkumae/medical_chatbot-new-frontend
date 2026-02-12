'use client';

import { useState } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Send, RefreshCw, AlertCircle, CheckCircle, Clock, Activity, Heart, Brain } from 'lucide-react';

export const GuidedAssessment = () => {
  const { 
    session, 
    currentQuestion, 
    isLoading, 
    error, 
    startAssessment, 
    submitResponse, 
    resetAssessment,
    assessmentSummary 
  } = useAssessment();
  
  const [input, setInput] = useState('');
  const [theme] = useState<'light' | 'dark'>('light'); // You can get this from theme context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const response = input.trim();
    setInput('');
    await submitResponse(response);
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'symptom':
        return <Activity className="w-5 h-5" />;
      case 'duration':
        return <Clock className="w-5 h-5" />;
      case 'severity':
        return <AlertCircle className="w-5 h-5" />;
      case 'additional_symptoms':
        return <Brain className="w-5 h-5" />;
      case 'medical_history':
        return <Heart className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getStepColor = (step: string) => {
    switch (step) {
      case 'symptom':
        return '#3b82f6'; // blue
      case 'duration':
        return '#10b981'; // green
      case 'severity':
        return '#f59e0b'; // amber
      case 'additional_symptoms':
        return '#8b5cf6'; // purple
      case 'medical_history':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return '#10b981'; // green
      case 'moderate':
        return '#f59e0b'; // amber
      case 'severe':
        return '#ef4444'; // red
      case 'very_severe':
        return '#dc2626'; // dark red
      default:
        return '#6b7280'; // gray
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return '#10b981'; // green
      case 'medium':
        return '#f59e0b'; // amber
      case 'high':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  if (!session && !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: theme === 'light' ? '#dbeafe' : '#1e3a8a' }}
        >
          <Activity 
            className="w-10 h-10" 
            style={{ color: theme === 'light' ? '#2563eb' : '#60a5fa' }}
          />
        </div>
        
        <h2 
          className="text-xl font-semibold mb-3"
          style={{ color: theme === 'light' ? '#111827' : '#f9fafb' }}
        >
          Guided Symptom Assessment
        </h2>
        
        <p 
          className="text-sm mb-6 max-w-md"
          style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}
        >
          Get personalized medical guidance by answering a few structured questions about your symptoms.
        </p>
        
        <button
          onClick={startAssessment}
          disabled={isLoading}
          className="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              Start Assessment
            </>
          )}
        </button>
        
        {error && (
          <div 
            className="mt-4 p-3 rounded-lg text-sm"
            style={{
              backgroundColor: theme === 'light' ? '#fef2f2' : '#7f1d1d',
              color: theme === 'light' ? '#dc2626' : '#fca5a5'
            }}
          >
            {error}
          </div>
        )}
      </div>
    );
  }

  if (assessmentSummary) {
    return (
      <div className="p-6 overflow-y-auto">
        <div className="mb-6">
          <h3 
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: theme === 'light' ? '#111827' : '#f9fafb' }}
          >
            <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
            Assessment Complete
          </h3>
          
          {/* Urgency Level */}
          <div 
            className="p-4 rounded-lg mb-4"
            style={{
              backgroundColor: theme === 'light' ? '#f9fafb' : '#374151'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span 
                className="font-medium"
                style={{ color: theme === 'light' ? '#111827' : '#f9fafb' }}
              >
                Urgency Level:
              </span>
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: getUrgencyColor(assessmentSummary.urgency_level) + '20',
                  color: getUrgencyColor(assessmentSummary.urgency_level)
                }}
              >
                {assessmentSummary.urgency_level.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Symptoms Summary */}
          <div 
            className="p-4 rounded-lg mb-4"
            style={{
              backgroundColor: theme === 'light' ? '#f9fafb' : '#374151'
            }}
          >
            <h4 
              className="font-medium mb-3"
              style={{ color: theme === 'light' ? '#111827' : '#f9fafb' }}
            >
              Symptoms Summary:
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" style={{ color: getStepColor('symptom') }} />
                <span style={{ color: theme === 'light' ? '#374151' : '#d1d5db' }}>
                  <strong>Primary:</strong> {assessmentSummary.primary_symptom}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: getStepColor('duration') }} />
                <span style={{ color: theme === 'light' ? '#374151' : '#d1d5db' }}>
                  <strong>Duration:</strong> {assessmentSummary.duration}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" style={{ color: getStepColor('severity') }} />
                <span style={{ color: theme === 'light' ? '#374151' : '#d1d5db' }}>
                  <strong>Severity:</strong>{' '}
                  <span 
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: getSeverityColor(assessmentSummary.severity) + '20',
                      color: getSeverityColor(assessmentSummary.severity)
                    }}
                  >
                    {assessmentSummary.severity?.replace('_', ' ').toUpperCase()}
                  </span>
                </span>
              </div>
              {assessmentSummary.additional_symptoms?.length > 0 && (
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" style={{ color: getStepColor('additional_symptoms') }} />
                  <span style={{ color: theme === 'light' ? '#374151' : '#d1d5db' }}>
                    <strong>Additional:</strong> {assessmentSummary.additional_symptoms.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Disease Predictions */}
          {assessmentSummary.disease_predictions?.length > 0 && (
            <div 
              className="p-4 rounded-lg mb-4"
              style={{
                backgroundColor: theme === 'light' ? '#f9fafb' : '#374151'
              }}
            >
              <h4 
                className="font-medium mb-3"
                style={{ color: theme === 'light' ? '#111827' : '#f9fafb' }}
              >
                Possible Conditions:
              </h4>
              <div className="space-y-2">
                {assessmentSummary.disease_predictions.map((prediction: any, index: number) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 rounded"
                    style={{
                      backgroundColor: theme === 'light' ? '#f3f4f6' : '#4b5563'
                    }}
                  >
                    <span 
                      className="text-sm font-medium"
                      style={{ color: theme === 'light' ? '#111827' : '#f9fafb' }}
                    >
                      {prediction.disease}
                    </span>
                    <span 
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: '#2563eb' + '20',
                        color: '#2563eb'
                      }}
                    >
                      {Math.round(prediction.confidence * 100)}% match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div 
            className="p-4 rounded-lg border-l-4"
            style={{
              backgroundColor: theme === 'light' ? '#fef3c7' : '#78350f',
              borderLeftColor: '#f59e0b',
              color: theme === 'light' ? '#92400e' : '#fbbf24'
            }}
          >
            <p className="text-sm font-medium mb-1">⚠️ Important Disclaimer</p>
            <p className="text-xs">
              This assessment provides general information and is not a substitute for professional medical care. 
              Always consult with a qualified healthcare provider for medical concerns, especially if symptoms are severe or worsening.
            </p>
          </div>
        </div>

        <button
          onClick={resetAssessment}
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          <RefreshCw className="w-4 h-4" />
          Start New Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress Indicator */}
      <div className="p-4 border-b" style={{ borderColor: theme === 'light' ? '#e5e7eb' : '#4b5563' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStepIcon(currentQuestion?.step || '')}
            <span 
              className="text-sm font-medium"
              style={{ color: theme === 'light' ? '#111827' : '#f9fafb' }}
            >
              Step {currentQuestion?.step === 'symptom' ? '1' : 
                     currentQuestion?.step === 'duration' ? '2' :
                     currentQuestion?.step === 'severity' ? '3' :
                     currentQuestion?.step === 'additional_symptoms' ? '4' : '5'} of 5
            </span>
          </div>
          <button
            onClick={resetAssessment}
            disabled={isLoading}
            className="text-sm flex items-center gap-1 transition-colors duration-200"
            style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </button>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: currentQuestion?.step === 'symptom' ? '20%' :
                     currentQuestion?.step === 'duration' ? '40%' :
                     currentQuestion?.step === 'severity' ? '60%' :
                     currentQuestion?.step === 'additional_symptoms' ? '80%' : '100%',
              backgroundColor: getStepColor(currentQuestion?.step || '')
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h3 
            className="text-lg font-semibold mb-4"
            style={{ color: theme === 'light' ? '#111827' : '#f9fafb' }}
          >
            {currentQuestion?.question}
          </h3>
          
          {currentQuestion?.examples && (
            <div className="mb-4">
              <p 
                className="text-sm mb-2"
                style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}
              >
                Examples:
              </p>
              <div className="flex flex-wrap gap-2">
                {currentQuestion.examples.map((example, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: theme === 'light' ? '#f3f4f6' : '#374151',
                      color: theme === 'light' ? '#374151' : '#d1d5db'
                    }}
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div 
            className="mb-4 p-3 rounded-lg text-sm"
            style={{
              backgroundColor: theme === 'light' ? '#fef2f2' : '#7f1d1d',
              color: theme === 'light' ? '#dc2626' : '#fca5a5'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response here..."
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              style={{
                border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
                backgroundColor: theme === 'light' ? '#ffffff' : '#374151',
                color: theme === 'light' ? '#111827' : '#f9fafb'
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
