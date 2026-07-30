-- Kullanıcılar ve Rolleri
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- Şifrelerin tutulacağı yeni alan eklendi
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Şirketler (İhale Takibi Yapacak Firmalar)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    tax_number TEXT UNIQUE,
    industry TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İhaleler
CREATE TABLE IF NOT EXISTS tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE, -- EKAP veya diğer kaynaklardaki ID
    title TEXT NOT NULL,
    description TEXT,
    notice_date DATE,
    tender_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    status TEXT DEFAULT 'active',
    raw_data JSONB, -- Kaynaktan gelen tüm ham veri
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);