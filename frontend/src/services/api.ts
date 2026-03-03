import axios from 'axios';
import { UploadResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const analyzeResume = async (file: File, jobDescription?: string): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('resume', file);
  
  if (jobDescription && jobDescription.trim()) {
    formData.append('jobDescription', jobDescription.trim());
  }

  const response = await api.post<UploadResponse>('/api/resume/analyze', formData);
  return response.data;
};

export default api;
