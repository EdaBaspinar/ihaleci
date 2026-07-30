import { Pool } from "pg";

// Veritabanı bağlantı havuzunu (Pool) oluşturuyoruz.
// Bağlantı bilgilerini güvenlik için .env dosyasından (DATABASE_URL) alacak.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;