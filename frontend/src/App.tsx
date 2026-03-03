import { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import ResultsDisplay from './components/ResultsDisplay';
import { AnalysisResult } from './types';
import './App.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setError('');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setAnalysisResult(null);
  };

  const clearError = () => {
    setError('');
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError('');
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Resume Analyzer</h1>
          <p className="subtitle">Professional resume analysis powered by AI technology</p>
        </header>

        <div className="features-bar">
          <div className="feature-item">
            <span>Instant Analysis</span>
          </div>
          <div className="feature-item">
            <span>ATS Compatible</span>
          </div>
          <div className="feature-item">
            <span>Detailed Insights</span>
          </div>
          <div className="feature-item">
            <span>Secure & Private</span>
          </div>
        </div>

        {error && (
          <div className="error">
            {error}
            <button className="error-close" onClick={clearError}>
              ✕
            </button>
          </div>
        )}

        {!analysisResult && (
          <ResumeUpload
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleError}
          />
        )}

        {analysisResult && (
          <>
            <button className="new-analysis-btn" onClick={handleReset}>
              Analyze New Resume
            </button>
            <ResultsDisplay result={analysisResult} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
