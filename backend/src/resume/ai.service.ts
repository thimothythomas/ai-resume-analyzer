import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HfInference } from '@huggingface/inference';

interface ScoreBreakdown {
  keywordMatch: number;
  skillsMatch: number;
  experienceScore: number;
  educationScore: number;
  formattingScore: number;
  quantificationScore: number;
}

@Injectable()
export class AiService {
  private hf: HfInference;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('HUGGINGFACE_API_KEY');
    
    if (!apiKey) {
      throw new Error('HUGGINGFACE_API_KEY is not configured');
    }
    
    this.hf = new HfInference(apiKey);
    
    console.log('✨ Hugging Face AI Service initialized');
    console.log('🤖 Using real AI analysis with Meta-Llama-3-8B');
  }

  async analyzeResume(resumeText: string, jobDescription?: string): Promise<any> {
    try {
      console.log('🤖 Analyzing resume with Hugging Face Meta-Llama...');
      
      const prompt = this.buildAnalysisPrompt(resumeText, jobDescription);
      
      const response = await this.hf.chatCompletion({
        model: 'meta-llama/Meta-Llama-3-8B-Instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an expert ATS (Applicant Tracking System) analyzer. You provide detailed, accurate resume analysis in JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });
      
      const responseText = response.choices[0]?.message?.content;
      
      if (!responseText) {
        throw new Error('No response from Hugging Face');
      }
      
      console.log('✅ Hugging Face analysis completed');
      
      return this.parseAIResponse(responseText);
    } catch (error) {
      console.error('Error in Hugging Face analysis:', error);
      throw new Error(`Failed to analyze resume: ${error.message}`);
    }
  }

  private buildAnalysisPrompt(resumeText: string, jobDescription?: string): string {
    const basePrompt = `You are an expert Applicant Tracking System (ATS) analyzer specializing in resume evaluation across all professional industries.

Analyze the following resume and provide a comprehensive ATS evaluation.

RESUME:
${resumeText}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}\n` : ''}

IMPORTANT: Respond ONLY with valid JSON. No other text, no markdown, no code blocks, just pure JSON.

Provide your analysis in the following JSON format:

{
  "atsMatch": <number 0-100>,
  "detectedDomain": "<industry domain: technology, finance, marketing, hr, healthcare, sales, operations, architecture, engineering, legal, education, design, hospitality, retail, manufacturing, construction, media, consulting, or general>",
  "relevantSkills": ["skill1", "skill2", "skill3"],
  "missingKeywords": ["keyword1", "keyword2"],
  "experienceSummary": "<2-3 sentence summary of candidate's experience and qualifications>",
  "redFlags": ["flag1", "flag2"],
  "hiringRecommendation": "<STRONG MATCH/GOOD MATCH/MODERATE MATCH/WEAK MATCH with detailed reasoning>",
  "scoreBreakdown": {
    "keywords": <number 0-35>,
    "skills": <number 0-20>,
    "experience": <number 0-25>,
    "education": <number 0-10>,
    "formatting": <number 0-10>,
    "quantification": <number 0-10>
  }${jobDescription ? `,
  "jdMatch": <number 0-100>,
  "tailoredSuggestions": ["suggestion1", "suggestion2"]` : ''}
}

SCORING CRITERIA:
- Keywords (0-35): Match with industry-standard keywords${jobDescription ? ' and job description requirements' : ''}
- Skills (0-20): Technical and soft skills relevance
- Experience (0-25): Work history quality, years, achievements
- Education (0-10): Degrees, certifications, relevance
- Formatting (0-10): ATS compatibility, structure, consistency
- Quantification (0-10): Use of metrics, numbers, measurable results

EVALUATION GUIDELINES:
1. Detect the professional domain/industry automatically
2. Extract relevant skills (both technical and soft skills)
3. Identify missing keywords or sections
4. Calculate detailed score breakdown
5. Identify red flags (gaps, missing info, formatting issues)
6. Provide hiring recommendation${jobDescription ? '\n7. Compare resume against job description\n8. Provide 5-7 tailored suggestions to improve match' : ''}

Remember: Output ONLY valid JSON. No markdown formatting, no \`\`\`json blocks, no explanations - just the raw JSON object.`;

    return basePrompt;
  }

  private parseAIResponse(responseText: string): any {
    try {
      // Remove markdown code blocks if present
      let cleanedText = responseText.trim();
      
      // Remove markdown json code blocks
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.substring(7);
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.substring(3);
      }
      
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3);
      }
      
      cleanedText = cleanedText.trim();
      
      const parsed = JSON.parse(cleanedText);
      
      // Ensure all required fields are present with defaults
      return {
        atsMatch: parsed.atsMatch || 0,
        detectedDomain: parsed.detectedDomain || 'general',
        relevantSkills: parsed.relevantSkills || [],
        missingKeywords: parsed.missingKeywords || ['None detected'],
        experienceSummary: parsed.experienceSummary || 'Unable to generate summary',
        redFlags: parsed.redFlags || ['None detected'],
        hiringRecommendation: parsed.hiringRecommendation || 'Unable to generate recommendation',
        scoreBreakdown: {
          keywords: parsed.scoreBreakdown?.keywords || 0,
          skills: parsed.scoreBreakdown?.skills || 0,
          experience: parsed.scoreBreakdown?.experience || 0,
          education: parsed.scoreBreakdown?.education || 0,
          formatting: parsed.scoreBreakdown?.formatting || 0,
          quantification: parsed.scoreBreakdown?.quantification || 0,
        },
        ...(parsed.jdMatch !== undefined && { jdMatch: parsed.jdMatch }),
        ...(parsed.tailoredSuggestions && { tailoredSuggestions: parsed.tailoredSuggestions }),
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Response text:', responseText);
      throw new Error('Failed to parse AI response. The AI may have returned invalid JSON.');
    }
  }
}

