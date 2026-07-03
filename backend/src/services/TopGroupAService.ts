import { PrismaClient } from '@prisma/client';
import { topGroupAModel, RawTopGroupA } from '../models/Student';

const prisma = new PrismaClient();

export class TopGroupAService {
  private static cache = new Map<number, topGroupAModel[]>();

  async getTopGroupA(limit: number = 10): Promise<topGroupAModel[]> {
    try {
      if (!TopGroupAService.cache.has(limit)) {
        console.log(`Calculating Top Group A students for limit ${limit} (cache miss)...`);

        const rawResults = await prisma.$queryRaw<RawTopGroupA[]>`
          SELECT 
            s.registration_number,
            MAX(CASE WHEN sub.code = 'toan' THEN sc.score END)::float as toan,
            MAX(CASE WHEN sub.code = 'vat_li' THEN sc.score END)::float as vat_li,
            MAX(CASE WHEN sub.code = 'hoa_hoc' THEN sc.score END)::float as hoa_hoc,
            SUM(sc.score)::float as total_score
          FROM students s
          JOIN scores sc ON s.id = sc.student_id
          JOIN subjects sub ON sc.subject_id = sub.id
          WHERE sub.code IN ('toan', 'vat_li', 'hoa_hoc')
          GROUP BY s.id, s.registration_number
          HAVING COUNT(DISTINCT sub.code) = 3
          ORDER BY total_score DESC
          LIMIT ${limit}
        `;

        const mapped = rawResults.map((row) => new topGroupAModel(row));
        TopGroupAService.cache.set(limit, mapped);
        console.log(`Cached ${mapped.length} Top Group A students for limit ${limit}.`);
      }

      return TopGroupAService.cache.get(limit)!;
    } catch (error) {
      console.error('Error fetching top group A students in TopGroupAService:', error);
      throw new Error('Failed to fetch top group A students');
    }
  }

  // Clear cache (useful if the DB is re-seeded while running)
  static clearCache(): void {
    TopGroupAService.cache.clear();
  }
}
