import sql from '../db';

export const documentChunkRepository = {
  // Verilen soru vektörüne en çok benzeyen şartname paragraflarını (chunk) bulur
  async findSimilar(opts: { queryEmbedding: number[]; tenderId?: string; limit?: number }) {
    const vec = '[' + opts.queryEmbedding.join(',') + ']';
    const limit = opts.limit ?? 5;
    
    if (opts.tenderId) {
      return sql<any[]>`
        SELECT id, content, page_number, tender_id,
          1 - (embedding <=> ${vec}::vector) AS similarity
        FROM document_chunks
        WHERE tender_id = ${opts.tenderId}
        ORDER BY embedding <=> ${vec}::vector
        LIMIT ${limit}
      `;
    }
    return [];
  },
};