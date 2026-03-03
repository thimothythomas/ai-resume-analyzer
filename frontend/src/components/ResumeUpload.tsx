import React, { useState, useRef } from 'react';
import { FileUploadProps } from '../types';
import { analyzeResume } from '../services/api';
import './ResumeUpload.css';

const ResumeUpload: React.FC<FileUploadProps> = ({ onAnalysisComplete, onError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(file.type)) {
      onError('Please upload a PDF or DOC/DOCX file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onError('File size must be less than 10MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const response = await analyzeResume(selectedFile, jobDescription);
      if (response.success) {
        onAnalysisComplete(response.data);
      } else {
        onError(response.message || 'Analysis failed');
      }
    } catch (error: any) {
      onError(error.response?.data?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="upload-container">
      {/* Job Description Input */}
      <div className="jd-section">
        <label htmlFor="job-description" className="jd-label">
          Job Description (Optional)
          <span className="jd-hint">Paste the job description to get tailored recommendations</span>
        </label>
        <textarea
          id="job-description"
          className="jd-textarea"
          placeholder="Paste the job description here...&#10;&#10;Example:&#10;We are looking for a Senior Software Engineer with 5+ years of experience in React, Node.js, and AWS. The ideal candidate should have strong problem-solving skills and experience with microservices architecture..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={6}
        />
      </div>

      <div
        className={`upload-area ${isDragging ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <div className="upload-text">Click to upload or drag and drop</div>
        <div className="upload-hint">Supported formats: PDF, DOC, DOCX (Max 10MB)</div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>

      {selectedFile && (
        <div className="file-info">
          <div className="file-name">{selectedFile.name}</div>
          <div className="file-size">{formatFileSize(selectedFile.size)}</div>
        </div>
      )}

      <button
        className="analyze-btn"
        onClick={handleAnalyze}
        disabled={!selectedFile || isLoading}
      >
        {isLoading ? (
          <>
            <div className="spinner"></div>
            Analyzing...
          </>
        ) : (
          'Analyze Resume'
        )}
      </button>
    </div>
  );
};

export default ResumeUpload;
