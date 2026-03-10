import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Res,
  UseGuards,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateDocumentDto } from './dto/create-document.dto';
import { SaveDraftDto } from './dto/save-draft.dto';
import { AddClauseDto } from './dto/add-clause.dto';
import { ContractType, DocumentStatus } from '../../generated/prisma/client.js';

@ApiTags('Documents')
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateDocumentDto) {
    return this.documentsService.create(user.sub, dto);
  }

  @Post(':id/draft')
  saveDraft(
    @CurrentUser() user: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SaveDraftDto,
  ) {
    return this.documentsService.saveDraft(id, user.sub, dto);
  }

  @Post(':id/generate')
  generate(
    @CurrentUser() user: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.documentsService.generate(id, user.sub);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('status') status?: DocumentStatus,
    @Query('contract_type') contractType?: ContractType,
  ) {
    return this.documentsService.findAll(user.sub, status, contractType);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.documentsService.findOne(id, user.sub);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.documentsService.remove(id, user.sub);
  }

  @Get(':id/versions')
  listVersions(
    @CurrentUser() user: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.documentsService.listVersions(id, user.sub);
  }

  @Post(':id/versions/:versionId/restore')
  restoreVersion(
    @CurrentUser() user: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('versionId', ParseUUIDPipe) versionId: string,
  ) {
    return this.documentsService.restoreVersion(id, versionId, user.sub);
  }

  @Post(':id/clauses')
  addClause(
    @CurrentUser() user: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddClauseDto,
  ) {
    return this.documentsService.addClause(id, dto.clause_id, user.sub);
  }

  @Get(':id/download')
  async download(
    @CurrentUser() user: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: express.Response,
  ) {
    const html = await this.documentsService.getDownloadHtml(id, user.sub);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="document-${id}.html"`,
    );
    res.send(html);
  }

  @Get(':id/download-docx')
  downloadDocx(
    @Param('id', ParseUUIDPipe) _id: string,
    @Res() res: express.Response,
  ) {
    res.status(HttpStatus.NOT_IMPLEMENTED).json({
      statusCode: 501,
      message: 'DOCX download is not yet implemented',
    });
  }
}
