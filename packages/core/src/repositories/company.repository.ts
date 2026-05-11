import sql from '../db';

export interface Company {
  id: string;
  userId: string;
  name: string;
  city?: string;
  nearbyCities?: string[];
  naceCodes?: string[];
  description?: string;
  certificates?: string[];
  budgetMin?: number;
  budgetMax?: number;
}

export const companyRepository = {
  // Şirketi veritabanına kaydeder
  async create(c: Omit<Company, 'id'>): Promise<Company> {
    const [row] = await sql<Company[]>`
      INSERT INTO companies (user_id, name, city, nearby_cities, nace_codes, description, certificates, budget_min, budget_max)
      VALUES (${c.userId}, ${c.name}, ${c.city ?? null},
              ${c.nearbyCities ?? sql.array([])}, ${c.naceCodes ?? sql.array([])},
              ${c.description ?? null}, ${c.certificates ?? sql.array([])},
              ${c.budgetMin ?? null}, ${c.budgetMax ?? null})
      RETURNING *
    `;
    return row;
  },

  // Şirket profilinin vektör (yapay zeka) karşılığını kaydeder
  async setEmbedding(id: string, embedding: number[]): Promise<void> {
    const vec = '[' + embedding.join(',') + ']';
    await sql`UPDATE companies SET profile_embedding = ${vec}::vector WHERE id = ${id}`;
  },

  // ID'ye göre şirketi bulur
  async findById(id: string): Promise<Company | null> {
    const [row] = await sql<Company[]>`SELECT * FROM companies WHERE id = ${id}`;
    return row ?? null;
  }
};