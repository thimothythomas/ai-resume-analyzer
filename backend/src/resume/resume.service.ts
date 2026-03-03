import { Injectable } from '@nestjs/common';
import { AiService } from './ai.service';
import { AnalysisResult } from './interfaces/analysis.interface';
import * as fs from 'fs';
import pdfParse from 'pdf-parse';

@Injectable()
export class ResumeService {
  constructor(private aiService: AiService) {}

  async analyzeResume(file: Express.Multer.File, jobDescription?: string): Promise<AnalysisResult> {
    try {
      // Extract text from resume
      const resumeText = await this.extractText(file);
      
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error('No text could be extracted from the resume');
      }
      
      // Analyze with AI (with optional job description)
      const analysis = await this.aiService.analyzeResume(resumeText, jobDescription);
      
      // Clean up uploaded file
      this.deleteFile(file.path);
      
      return analysis;
    } catch (error) {
      // Clean up file even on error
      if (file?.path) {
        this.deleteFile(file.path);
      }
      throw error;
    }
  }

  private async extractText(file: Express.Multer.File): Promise<string> {
    const { mimetype, path, buffer } = file;

    try {
      // Use buffer if available, otherwise use path
      const dataBuffer = buffer || fs.readFileSync(path);
      
      if (mimetype === 'application/pdf') {
        const data = await pdfParse(dataBuffer);
        return data.text;
      } else if (
        mimetype === 'application/msword' ||
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        // For simple text extraction from DOC/DOCX
        // Convert buffer to string and extract readable text
        const content = dataBuffer.toString('utf-8');
        // Remove binary data and keep only readable text
        const cleanText = content
          .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Remove non-printable characters
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        return cleanText;
      } else {
        throw new Error('Unsupported file format');
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error('Failed to extract text from resume. Please ensure the file is a valid PDF or DOC/DOCX file.');
    }
  }

  private deleteFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }
}
