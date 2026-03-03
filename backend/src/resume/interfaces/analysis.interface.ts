export interface AnalysisResult {
  atsMatch: number;
  missingKeywords: string[];
  relevantSkills: string[];
  experienceSummary: string;
  redFlags: string[];
  hiringRecommendation: string;
  tailoredSuggestions?: string[]; // JD-specific suggestions
  jdMatch?: number; // Match percentage specifically for the job description
  detectedDomain?: string; // Auto-detected industry/domain
  scoreBreakdown?: {
    keywords: number;
    skills: number;
    experience: number;
    education: number;
    formatting: number;
    quantification: number;
  };
}

export interface AnalysisResponse {
  success: boolean;
  data: AnalysisResult;
  message?: string;
}
