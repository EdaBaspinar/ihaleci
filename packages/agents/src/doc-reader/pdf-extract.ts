import _pdfParse from 'pdf-parse';
const pdfParse = _pdfParse as any;
import fs from 'node:fs';

export async function extractPdfText(filePath: string): Promise<{
  text: string;
  pages: number;
  info: Record<string, unknown>;
}> {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);

  return {
    text: data.text,
    pages: data.numpages,
    info: data.info as Record<string, unknown>,
  };
}