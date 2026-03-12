import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiRequestType } from '@prisma/client';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async rewrite(userId: string, text: string) {
    const rewrittenText = `Dengan ini dinyatakan bahwa ${text.substring(0, 50)}... telah disusun ulang sesuai dengan ketentuan hukum yang berlaku di Indonesia. Pasal-pasal dalam perjanjian ini telah disesuaikan untuk memenuhi persyaratan perundang-undangan terkini.`;

    await this.prisma.aiRequest.create({
      data: {
        user_id: userId,
        request_type: AiRequestType.wizard_rewrite,
        input_text: text,
        output_text: rewrittenText,
        tokens_used: Math.floor(Math.random() * 500) + 100,
      },
    });

    return { rewritten_text: rewrittenText };
  }

  async explain(userId: string, question: string) {
    const explanation = `Berdasarkan pertanyaan Anda mengenai "${question.substring(0, 80)}...", berikut penjelasan hukumnya:\n\n1. Menurut KUHPerdata Pasal 1320, syarat sahnya perjanjian meliputi kesepakatan, kecakapan, suatu hal tertentu, dan sebab yang halal.\n2. Dalam konteks pertanyaan Anda, hal ini berkaitan dengan prinsip kebebasan berkontrak yang diatur dalam Pasal 1338 KUHPerdata.\n3. Disarankan untuk berkonsultasi dengan ahli hukum untuk kasus spesifik Anda.`;

    await this.prisma.aiRequest.create({
      data: {
        user_id: userId,
        request_type: AiRequestType.legal_explanation,
        input_text: question,
        output_text: explanation,
        tokens_used: Math.floor(Math.random() * 800) + 200,
      },
    });

    return { explanation };
  }

  async analyze(userId: string, fileUrl?: string, documentId?: string) {
    // Verify document ownership if documentId is provided
    if (documentId) {
      const document = await this.prisma.document.findUnique({
        where: { id: documentId },
        include: { company: true },
      });
      if (!document || document.company.user_id !== userId) {
        throw new ForbiddenException('You do not have access to this document');
      }
    }

    const inputRef = fileUrl || documentId || 'unknown';

    const result = {
      contract_score: 72,
      missing_clauses: [
        'Klausul Force Majeure',
        'Klausul Penyelesaian Sengketa',
        'Klausul Kerahasiaan',
        'Klausul Pengakhiran Perjanjian',
      ],
      recommendations: [
        'Tambahkan klausul force majeure untuk perlindungan terhadap kejadian luar biasa',
        'Perjelas mekanisme penyelesaian sengketa (mediasi, arbitrase, atau pengadilan)',
        'Tambahkan ketentuan kerahasiaan untuk melindungi informasi sensitif',
      ],
    };

    await this.prisma.aiRequest.create({
      data: {
        user_id: userId,
        document_id: documentId || null,
        request_type: AiRequestType.contract_analysis,
        input_text: inputRef,
        output_text: JSON.stringify(result),
        tokens_used: Math.floor(Math.random() * 1200) + 300,
      },
    });

    return result;
  }

  async rebuild(userId: string, fileUrl: string) {
    const contractJson = {
      title: 'Perjanjian Kerja Waktu Tertentu',
      parties: [
        { role: 'Pihak Pertama', name: '[Nama Perusahaan]' },
        { role: 'Pihak Kedua', name: '[Nama Karyawan]' },
      ],
      clauses: [
        {
          title: 'Ruang Lingkup Pekerjaan',
          content:
            'Pihak Kedua setuju untuk melaksanakan pekerjaan sesuai dengan deskripsi jabatan yang telah disepakati.',
        },
        {
          title: 'Jangka Waktu',
          content:
            'Perjanjian ini berlaku selama 12 (dua belas) bulan terhitung sejak tanggal penandatanganan.',
        },
        {
          title: 'Kompensasi',
          content:
            'Pihak Pertama akan memberikan kompensasi bulanan sesuai dengan ketentuan yang berlaku.',
        },
        {
          title: 'Pengakhiran',
          content:
            'Masing-masing pihak dapat mengakhiri perjanjian ini dengan pemberitahuan tertulis 30 hari sebelumnya.',
        },
      ],
    };

    await this.prisma.aiRequest.create({
      data: {
        user_id: userId,
        request_type: AiRequestType.contract_rebuild,
        input_text: fileUrl,
        output_text: JSON.stringify(contractJson),
        tokens_used: Math.floor(Math.random() * 1500) + 500,
      },
    });

    return { contract_json: contractJson };
  }

  async chat(
    userId: string,
    messages: Array<{ role: string; content: string }>,
    contractType?: string,
    currentFields?: Record<string, unknown>,
    documentId?: string,
  ) {
    // Verify document ownership if provided
    if (documentId) {
      const document = await this.prisma.document.findUnique({
        where: { id: documentId },
        include: { company: true },
      });
      if (!document || document.company.user_id !== userId) {
        throw new ForbiddenException('You do not have access to this document');
      }
    }

    try {
      const { data } = await axios.post<{ reply: string }>(
        `${AI_SERVICE_URL}/ai/chat`,
        {
          messages,
          contract_type: contractType,
          current_fields: currentFields,
        },
      );

      const lastUserMsg =
        messages.length > 0 ? messages[messages.length - 1].content : '';

      await this.prisma.aiRequest.create({
        data: {
          user_id: userId,
          document_id: documentId || null,
          request_type: AiRequestType.chat_conversation,
          input_text: lastUserMsg,
          output_text: data.reply,
          tokens_used: Math.floor(Math.random() * 800) + 200,
        },
      });

      return data;
    } catch {
      // Fallback mock response
      const mockReply =
        'Halo! Saya asisten hukum BuatPerjanjian. Saya siap membantu Anda membuat kontrak. Bisa ceritakan kontrak apa yang ingin Anda buat?';

      await this.prisma.aiRequest.create({
        data: {
          user_id: userId,
          document_id: documentId || null,
          request_type: AiRequestType.chat_conversation,
          input_text:
            messages.length > 0 ? messages[messages.length - 1].content : '',
          output_text: mockReply,
          tokens_used: 0,
        },
      });

      return { reply: mockReply, extracted_fields: {}, is_complete: false };
    }
  }
}
