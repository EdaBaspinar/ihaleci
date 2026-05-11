import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'ihaleci',
  username: 'ihaleci',
  password: 'ihaleci_local_dev',
});

async function migrate() {
  console.log('🚀 Migration işlemi başlatılıyor...');

  try {
    // process.cwd() önündeki o __ işaretlerini kaldırdık
    const migrationsDir = path.join(process.cwd(), 'db', 'migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      throw new Error('Migration klasörü bulunamadı!');
    }

    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`📑 Uygulanıyor: ${file}`);
        const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await sql.unsafe(content);
      }
    }

    console.log('✅ Tüm tablolar başarıyla oluşturuldu!');
  } catch (error) {
    console.error('❌ Migration hatası:', error);
  } finally {
    await sql.end();
    process.exit();
  }
}

migrate();