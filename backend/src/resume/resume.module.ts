import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { AiService } from './ai.service';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService, AiService],
})
export class ResumeModule {}
