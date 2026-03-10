import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RewriteDto } from './dto/rewrite.dto';
import { ExplainDto } from './dto/explain.dto';
import { AnalyzeDto } from './dto/analyze.dto';
import { RebuildDto } from './dto/rebuild.dto';

@ApiTags('AI')
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('rewrite')
  rewrite(@CurrentUser() user: any, @Body() dto: RewriteDto) {
    return this.aiService.rewrite(user.sub, dto.text);
  }

  @Post('explain')
  explain(@CurrentUser() user: any, @Body() dto: ExplainDto) {
    return this.aiService.explain(user.sub, dto.question);
  }

  @Post('analyze')
  analyze(@CurrentUser() user: any, @Body() dto: AnalyzeDto) {
    return this.aiService.analyze(user.sub, dto.file_url, dto.document_id);
  }

  @Post('rebuild')
  rebuild(@CurrentUser() user: any, @Body() dto: RebuildDto) {
    return this.aiService.rebuild(user.sub, dto.file_url);
  }
}
