import { PrismaClient } from '@prisma/client';
import { StatisticModel, RawScoreStatistic } from '../models/Subject';

const prisma = new PrismaClient();

export class StatisticService {
  private static cachedStatistics: StatisticModel[] | null = null;

  async getStatisticsForSubjects(subjectFilter?: string): Promise<StatisticModel[]> {
    try {
      if (!StatisticService.cachedStatistics) {
        console.log('Calculating score statistics (cache miss)...');
        
        // Execute the raw query to evaluate scores into bands
        // to optimize performance
        const rawRecords = await prisma.$queryRaw<RawScoreStatistic[]>`
          SELECT 
            sub.code AS subject,
            CASE 
              WHEN sc.score >= 8 THEN '>=8'
              WHEN sc.score >= 6 THEN '[6,8)'
              WHEN sc.score >= 4 THEN '[4,6)'
              ELSE '<4'
            END AS band,
            COUNT(*)::int AS count
          FROM scores sc
          JOIN subjects sub ON sc.subject_id = sub.id
          GROUP BY sub.code, band
          ORDER BY sub.code ASC, band ASC
        `;

        if (!rawRecords || rawRecords.length === 0) {
          StatisticService.cachedStatistics = [];
        } else {
          // Group raw records by subject code
          const groupedMap = new Map<string, RawScoreStatistic[]>();
          for (const record of rawRecords) {
            if (!groupedMap.has(record.subject)) {
              groupedMap.set(record.subject, []);
            }
            groupedMap.get(record.subject)!.push(record);
          }

          // Convert grouped map to StatisticModel instances
          const models: StatisticModel[] = [];
          for (const [subject, records] of groupedMap.entries()) {
            models.push(new StatisticModel(subject, records));
          }

          StatisticService.cachedStatistics = models;
          console.log(`Cached score statistics for ${StatisticService.cachedStatistics.length} subjects.`);
        }
      }

      // Check subjectFilter option
      // Also return cached data
      // To optimize performance
      if (subjectFilter && subjectFilter.trim() !== '') {
        const target = subjectFilter.trim();
        return StatisticService.cachedStatistics.filter((m) => m.subject === target);
      }

      return StatisticService.cachedStatistics;
    } catch (error) {
      console.error('Error fetching statistics from db:', error);
      throw new Error('Failed to fetch statistics data');
    }
  }

  // Invalidate cache data
  static clearCache(): void {
    StatisticService.cachedStatistics = null;
  }
}
