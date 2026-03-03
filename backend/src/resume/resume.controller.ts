import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { AnalysisResponse } from './interfaces/analysis.interface';

@Controller('api/resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('resume'))
  async analyzeResume(
    @UploadedFile() file: Express.Multer.File,
    @Body('jobDescription') jobDescription?: string,
  ): Promise<AnalysisResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Please upload PDF or DOC/DOCX');
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File size must be less than 10MB');
    }

    try {
      const analysis = await this.resumeService.analyzeResume(file, jobDescription);
      
      return {
        success: true,
        data: analysis,
      };
    } catch (error) {
      console.error('Analysis error:', error);
      throw new BadRequestException(
        error.message || 'Failed to analyze resume',
      );
    }
  }
}
