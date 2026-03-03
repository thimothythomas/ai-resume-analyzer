import React from 'react';
import { ResultsProps } from '../types';
import './ResultsDisplay.css';

const ResultsDisplay: React.FC<ResultsProps> = ({ result }) => {
  if (!result) return null;

  // Determine match level for color coding
  const getMatchColor = (score: number) => {
    if (score >= 80) return '#4caf50'; // Green
    if (score >= 65) return '#8b9de8'; // Blue
    if (score >= 50) return '#ff9800'; // Orange
    return '#ff6b6b'; // Red
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return { text: 'Strong Match' };
    if (score >= 65) return { text: 'Good Match' };
    if (score >= 50) return { text: 'Moderate Match' };
    return { text: 'Weak Match' };
  };

  const handleExport = () => {
    const exportData = {
      analysisDate: new Date().toLocaleDateString(),
      ...result
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const matchLabel = getMatchLabel(result.atsMatch);
  const scoreColor = getMatchColor(result.atsMatch);

  return (
    <div className="results">
      <div className="results-header">
        <h2 className="results-title">Analysis Report</h2>
        <div className="results-actions">
          {result.detectedDomain && (
            <div className="domain-badge">
              {result.detectedDomain.charAt(0).toUpperCase() + result.detectedDomain.slice(1)} Resume
            </div>
          )}
          <button className="action-btn" onClick={handleExport} title="Export Results">
            Export
          </button>
          <button className="action-btn" onClick={handlePrint} title="Print Report">
            Print
          </button>
        </div>
      </div>

      {/* Score Section with Visual Progress */}
      <div className="score-card">
        <div className="score-header">
          <div className="score-label">ATS Match Score</div>
          <div className="score-badge" style={{ backgroundColor: scoreColor }}>
            {matchLabel.text}
          </div>
        </div>
        <div className="score-display">
          <div className="score-number" style={{ color: scoreColor }}>
            {result.atsMatch}%
          </div>
          <div className="score-progress-container">
            <div 
              className="score-progress-bar" 
              style={{ 
                width: `${result.atsMatch}%`,
                backgroundColor: scoreColor
              }}
            >
              <span className="score-progress-label">{result.atsMatch}%</span>
            </div>
          </div>
        </div>
        <div className="score-breakdown">
          <div className="breakdown-item">
            <span className="breakdown-label">Keywords</span>
            <span className="breakdown-value">
              {result.scoreBreakdown ? `${Math.round((result.scoreBreakdown.keywords / 35) * 100)}%` : '75%'}
            </span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Skills</span>
            <span className="breakdown-value">
              {result.scoreBreakdown ? `${Math.round((result.scoreBreakdown.skills / 20) * 100)}%` : '80%'}
            </span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Experience</span>
            <span className="breakdown-value">
              {result.scoreBreakdown ? `${Math.round((result.scoreBreakdown.experience / 25) * 100)}%` : '85%'}
            </span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Format</span>
            <span className="breakdown-value">
              {result.scoreBreakdown ? `${Math.round((result.scoreBreakdown.formatting / 10) * 100)}%` : '90%'}
            </span>
          </div>
        </div>
      </div>

      {/* Job Description Match Section (if JD provided) */}
      {result.jdMatch !== undefined && (
        <div className="jd-match-card">
          <div className="jd-match-header">
            <h3 className="jd-match-title">Job Description Match</h3>
            <div className="jd-match-score" style={{ 
              backgroundColor: getMatchColor(result.jdMatch),
              color: 'white'
            }}>
              {result.jdMatch}%
            </div>
          </div>
          <p className="jd-match-description">
            Your resume has a <strong>{result.jdMatch}%</strong> match with the provided job description.
            {result.jdMatch >= 70 && ' Great alignment with the job requirements!'}
            {result.jdMatch >= 50 && result.jdMatch < 70 && ' Good foundation, but consider the suggestions below to improve your match.'}
            {result.jdMatch < 50 && ' Consider tailoring your resume to better match the job requirements.'}
          </p>
        </div>
      )}

      {/* Grid Layout for Results */}
      <div className="results-grid">
        {/* Skills Section */}
        <div className="result-card">
          <div className="card-header">
            <h3 className="card-title">Relevant Skills</h3>
            <span className="card-count">{result.relevantSkills.length}</span>
          </div>
          <div className="card-content">
            {result.relevantSkills && result.relevantSkills.length > 0 ? (
              <div className="skills-tags">
                {result.relevantSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="empty-state">No specific skills identified</p>
            )}
          </div>
        </div>

        {/* Missing Keywords Section */}
        <div className="result-card">
          <div className="card-header">
            <h3 className="card-title">Missing Keywords</h3>
            <span className="card-count">{result.missingKeywords[0] === 'None - All key sections present' ? 0 : result.missingKeywords.length}</span>
          </div>
          <div className="card-content">
            <ul className="card-list">
              {result.missingKeywords.map((keyword, index) => (
                <li key={index} className={keyword === 'None - All key sections present' ? 'positive-item' : ''}>
                  {keyword}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Experience Summary */}
        <div className="result-card full-width">
          <div className="card-header">
            <h3 className="card-title">Experience Summary</h3>
          </div>
          <div className="card-content">
            <p className="summary-text">{result.experienceSummary}</p>
          </div>
        </div>

        {/* Red Flags */}
        <div className="result-card">
          <div className="card-header">
            <h3 className="card-title">Red Flags</h3>
            <span className="card-count">{result.redFlags[0] === 'None detected' ? 0 : result.redFlags.length}</span>
          </div>
          <div className="card-content">
            <ul className="card-list red-flags-list">
              {result.redFlags.map((flag, index) => (
                <li key={index} className={flag === 'None detected' ? 'positive-item' : 'negative-item'}>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hiring Recommendation */}
        <div className="result-card recommendation-card">
          <div className="card-header">
            <h3 className="card-title">Hiring Recommendation</h3>
          </div>
          <div className="card-content">
            <div className="recommendation-box">
              <p className="recommendation-text">{result.hiringRecommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="tips-section">
        <h3 className="tips-title">Pro Tips to Improve Your Score</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-content">
              <h4>Use Action Verbs</h4>
              <p>Start bullet points with strong action verbs like "Led", "Developed", "Implemented"</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-content">
              <h4>Quantify Achievements</h4>
              <p>Include numbers, percentages, and metrics to demonstrate impact</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-content">
              <h4>Tailor to Job</h4>
              <p>Customize your resume for each position using job description keywords</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-content">
              <h4>Simple Format</h4>
              <p>Use standard headings and avoid complex graphics for ATS compatibility</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tailored Suggestions Section (if JD provided) */}
      {result.tailoredSuggestions && result.tailoredSuggestions.length > 0 && (
        <div className="tailored-section">
          <h3 className="tailored-title">Tailored Suggestions for This Job</h3>
          <p className="tailored-subtitle">Based on the job description you provided, here's how to improve your match:</p>
          <div className="suggestions-list">
            {result.tailoredSuggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                <div className="suggestion-number">{index + 1}</div>
                <div className="suggestion-text">{suggestion}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
