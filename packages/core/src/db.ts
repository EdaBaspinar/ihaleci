import postgres from 'postgres';

// .env dosyasındaki adresi kullanır
const connectionString = process.env.DATABASE_URL || 'postgres://ihaleci:ihaleci_local_dev@localhost:5432/ihaleci';

export const sql = postgres(connectionString);
export default sql;