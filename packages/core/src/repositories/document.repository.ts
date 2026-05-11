import sql from '../db';
import { DocumentChunk } from '../types/document';

export class DocumentRepository {
  // 1. Yeni bir doküman parçasını ve vektörünü kaydetme
  async insertChunk(chunk: Omit<DocumentChunk, 'id' | 'createdAt'>): Promise<void> {
    const embeddingString = chunk.embedding 
      ? `[${chunk.embedding.join(',')}]` 
      : null;

    await sql`
      INSERT INTO document_chunks (tender_id, chunk_index, content, embedding)
      VALUES (${chunk.tenderId}, ${chunk.chunkIndex}, ${chunk.content}, ${embeddingString}::vector)
    `;
  }

  // 2. Bir ihaleye ait tüm parçaları temizleme
  async deleteChunksByTenderId(tenderId: string): Promise<void> {
    await sql`
      DELETE FROM document_chunks WHERE tender_id = ${tenderId}
    `;
  }

  // 3. VEKTÖR ARAMASI (RAG sistemimizin kalbi!)
  async searchSimilarChunks(opts: {
    tenderId?: string;
    queryEmbedding: number[];
    limit?: number;
  }): Promise<Array<{ chunkIndex: number; content: string; similarity: number }>> {
    const limit = opts.limit ?? 5;
    const embeddingString = `[${opts.queryEmbedding.join(',')}]`;

    let rows;
    
    // Eğer belirli bir ihale içinde arıyorsak
    if (opts.tenderId) {
      rows = await sql`
        SELECT chunk_index as "chunkIndex", content, 
               (1 - (embedding <=> ${embeddingString}::vector)) as similarity
        FROM document_chunks
        WHERE tender_id = ${opts.tenderId}
        ORDER BY embedding <=> ${embeddingString}::vector 
        LIMIT ${limit}
      `;
    } 
    // Tüm ihalelerde genel arama yapıyorsak
    else {
      rows = await sql`
        SELECT chunk_index as "chunkIndex", content, 
               (1 - (embedding <=> ${embeddingString}::vector)) as similarity
        FROM document_chunks
        ORDER BY embedding <=> ${embeddingString}::vector 
        LIMIT ${limit}
      `;
    }

    return rows as any;
  }
}