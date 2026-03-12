import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtUser } from '../auth/interfaces/jwt-user.interface';
import { RewriteDto } from './dto/rewrite.dto';
import { ExplainDto } from './dto/explain.dto';
import { AnalyzeDto } from './dto/analyze.dto';
import { RebuildDto } from './dto/rebuild.dto';
import { ChatDto } from './dto/chat.dto';

@ApiTags('AI')
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('rewrite')
  rewrite(@CurrentUser() user: JwtUser, @Body() dto: RewriteDto) {
    return this.aiService.rewrite(user.id, dto.text);
  }

  @Post('explain')
  explain(@CurrentUser() user: JwtUser, @Body() dto: ExplainDto) {
    return this.aiService.explain(user.id, dto.question);
  }

  @Post('analyze')
  analyze(@CurrentUser() user: JwtUser, @Body() dto: AnalyzeDto) {
    return this.aiService.analyze(user.id, dto.file_url, dto.document_id);
  }

  @Post('rebuild')
  rebuild(@CurrentUser() user: JwtUser, @Body() dto: RebuildDto) {
    return this.aiService.rebuild(user.id, dto.file_url);
  }

  @Post('chat')
  chat(@CurrentUser() user: JwtUser, @Body() dto: ChatDto) {
    return this.aiService.chat(
      user.id,
      dto.messages,
      dto.contract_type,
      dto.current_fields,
      dto.document_id,
    );
  }
}
