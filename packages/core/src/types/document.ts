export interface DocumentChunk {
    id: string;
    tenderId: string;
    chunkIndex: number;
    content: string;
    embedding?: number[]; // pgvector için sayı dizisi olarak saklayacağız
    createdAt: Date;
  }