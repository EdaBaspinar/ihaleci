export interface Chunk {
    index: number;
    content: string;
    pageNumberHint?: number;
  }
  
  export function chunkText(rawText: string, opts?: { maxWordsPerChunk?: number; overlap?: number }): Chunk[] {
    const maxWords = opts?.maxWordsPerChunk ?? 800;
    const overlap = opts?.overlap ?? 100;
    
    // Paragraflara bölüyoruz
    const paragraphs = rawText
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  
    const chunks: Chunk[] = [];
    let buffer: string[] = [];
    let wordCount = 0;
  
    const flush = () => {
      if (buffer.length === 0) return;
      chunks.push({ index: chunks.length, content: buffer.join('\n\n') });
  
      // Örtüşme (overlap) yaratarak anlamsal bağlam kaybını önlüyoruz
      if (overlap > 0) {
        const lastWords = buffer.join(' ').split(/\s+/).slice(-overlap).join(' ');
        buffer = [lastWords];
        wordCount = overlap;
      } else {
        buffer = [];
        wordCount = 0;
      }
    };
  
    for (const p of paragraphs) {
      const pWords = p.split(/\s+/).length;
  
      if (wordCount + pWords > maxWords && buffer.length > 0) {
        flush();
      }
      buffer.push(p);
      wordCount += pWords;
    }
    flush();
    return chunks;
  }