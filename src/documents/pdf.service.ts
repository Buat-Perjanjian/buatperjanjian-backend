import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  private readonly htmlWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #1a1a1a;
      margin: 0;
      padding: 0;
    }
    h1 { font-size: 18pt; text-align: center; margin-bottom: 8pt; }
    h2 { font-size: 14pt; margin-top: 16pt; margin-bottom: 8pt; }
    h3 { font-size: 12pt; margin-top: 12pt; margin-bottom: 6pt; }
    p { margin: 6pt 0; text-align: justify; }
    table { width: 100%; border-collapse: collapse; margin: 8pt 0; }
    td, th { padding: 4pt 8pt; vertical-align: top; }
    ul, ol { margin: 6pt 0; padding-left: 24pt; }
    li { margin: 3pt 0; }
    strong { font-weight: bold; }
  </style>
</head>
<body>${content}</body>
</html>`;

  async generatePdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(this.htmlWrapper(html), {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
        printBackground: true,
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}
