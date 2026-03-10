import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { SaveDraftDto } from './dto/save-draft.dto';
import { ContractType, DocumentStatus } from '@prisma/client';
import * as Handlebars from 'handlebars';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyOwnership(documentId: string, userId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { company: true },
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    if (document.company.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this document');
    }
    return document;
  }

  async create(userId: string, dto: CreateDocumentDto) {
    // Verify company belongs to user
    const company = await this.prisma.company.findUnique({
      where: { id: dto.company_id },
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    if (company.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this company');
    }

    // Find matching template
    const template = await this.prisma.documentTemplate.findFirst({
      where: { contract_type: dto.contract_type },
    });

    const title =
      dto.title || `${dto.contract_type} - ${new Date().toISOString().slice(0, 10)}`;

    return this.prisma.document.create({
      data: {
        company_id: dto.company_id,
        template_id: template?.id ?? null,
        title,
        contract_type: dto.contract_type,
        versions: {
          create: {
            version_number: 1,
          },
        },
      },
      include: {
        versions: true,
      },
    });
  }

  async saveDraft(documentId: string, userId: string, dto: SaveDraftDto) {
    await this.verifyOwnership(documentId, userId);

    const latestVersion = await this.prisma.documentVersion.findFirst({
      where: { document_id: documentId },
      orderBy: { version_number: 'desc' },
    });
    if (!latestVersion) {
      throw new NotFoundException('No version found for this document');
    }

    return this.prisma.documentVersion.update({
      where: { id: latestVersion.id },
      data: { content_json: dto.data },
    });
  }

  async generate(documentId: string, userId: string) {
    const document = await this.verifyOwnership(documentId, userId);

    if (!document.template_id) {
      throw new BadRequestException('Document has no template assigned');
    }

    const template = await this.prisma.documentTemplate.findUnique({
      where: { id: document.template_id },
    });
    if (!template || !template.template_html) {
      throw new BadRequestException('Template not found or has no HTML');
    }

    const latestVersion = await this.prisma.documentVersion.findFirst({
      where: { document_id: documentId },
      orderBy: { version_number: 'desc' },
    });
    if (!latestVersion) {
      throw new NotFoundException('No version found');
    }

    const wizardData =
      (latestVersion.content_json as Record<string, any>) || {};
    const compiled = Handlebars.compile(template.template_html);
    const html = compiled(wizardData);

    const newVersion = await this.prisma.documentVersion.create({
      data: {
        document_id: documentId,
        version_number: latestVersion.version_number + 1,
        content_html: html,
        content_json: wizardData,
      },
    });

    await this.prisma.document.update({
      where: { id: documentId },
      data: { status: DocumentStatus.generated },
    });

    return { document_id: documentId, preview_html: html };
  }

  async findOne(documentId: string, userId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: {
        company: true,
        template: { select: { id: true, name: true, contract_type: true } },
        clauses: { orderBy: { order_index: 'asc' } },
        versions: { orderBy: { version_number: 'desc' }, take: 1 },
      },
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    if (document.company.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this document');
    }
    return document;
  }

  async findAll(
    userId: string,
    status?: DocumentStatus,
    contractType?: ContractType,
  ) {
    const companies = await this.prisma.company.findMany({
      where: { user_id: userId },
      select: { id: true },
    });
    const companyIds = companies.map((c) => c.id);

    return this.prisma.document.findMany({
      where: {
        company_id: { in: companyIds },
        ...(status && { status }),
        ...(contractType && { contract_type: contractType }),
      },
      include: {
        company: { select: { id: true, name: true } },
        template: { select: { id: true, name: true } },
      },
      orderBy: { updated_at: 'desc' },
    });
  }

  async remove(documentId: string, userId: string) {
    await this.verifyOwnership(documentId, userId);
    await this.prisma.document.delete({ where: { id: documentId } });
    return { message: 'Document deleted' };
  }

  async listVersions(documentId: string, userId: string) {
    await this.verifyOwnership(documentId, userId);
    return this.prisma.documentVersion.findMany({
      where: { document_id: documentId },
      orderBy: { version_number: 'desc' },
    });
  }

  async restoreVersion(
    documentId: string,
    versionId: string,
    userId: string,
  ) {
    await this.verifyOwnership(documentId, userId);

    const version = await this.prisma.documentVersion.findUnique({
      where: { id: versionId },
    });
    if (!version || version.document_id !== documentId) {
      throw new NotFoundException('Version not found');
    }

    const latestVersion = await this.prisma.documentVersion.findFirst({
      where: { document_id: documentId },
      orderBy: { version_number: 'desc' },
    });

    return this.prisma.documentVersion.create({
      data: {
        document_id: documentId,
        version_number: (latestVersion?.version_number ?? 0) + 1,
        content_html: version.content_html,
        content_json: version.content_json ?? undefined,
      },
    });
  }

  async getDownloadHtml(documentId: string, userId: string) {
    await this.verifyOwnership(documentId, userId);

    const latestVersion = await this.prisma.documentVersion.findFirst({
      where: { document_id: documentId },
      orderBy: { version_number: 'desc' },
    });

    if (!latestVersion || !latestVersion.content_html) {
      throw new BadRequestException(
        'Document has no generated HTML. Please generate the document first.',
      );
    }

    return latestVersion.content_html;
  }

  async addClause(documentId: string, clauseId: string, userId: string) {
    await this.verifyOwnership(documentId, userId);

    const clause = await this.prisma.clausesLibrary.findUnique({
      where: { id: clauseId },
    });
    if (!clause) {
      throw new NotFoundException('Clause not found in library');
    }

    const lastClause = await this.prisma.documentClause.findFirst({
      where: { document_id: documentId },
      orderBy: { order_index: 'desc' },
    });

    return this.prisma.documentClause.create({
      data: {
        document_id: documentId,
        clause_title: clause.title,
        clause_content: clause.clause_text,
        order_index: (lastClause?.order_index ?? -1) + 1,
      },
    });
  }
}
