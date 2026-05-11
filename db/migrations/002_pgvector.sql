-- 1. Vektör eklentisini etkinleştir
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Akıllı parçalarımız (chunk) ve Gemini vektörlerimiz (3072 boyut) için yeni tablo
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(3072),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);