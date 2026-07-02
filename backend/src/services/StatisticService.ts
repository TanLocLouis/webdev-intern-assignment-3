import { PrismaClient } from '@prisma/client';
import { StatisticModel } from '../models/StatisticModel';

const prisma = new PrismaClient();

export class StatisticService {
  async getStatisticsForSubjects(subjectFilter?: string): Promise<StatisticModel[]> {
    try {
      const whereCondition = subjectFilter && subjectFilter.trim() !== ''
        ? { subject: subjectFilter.trim() }
        : {};

      const rawRecords = await prisma.scoreStatistic.findMany({
        where: whereCondition,
        orderBy: [
          { subject: 'asc' },
          { band: 'asc' },
        ],
      });

      // If no records are found, return an empty array
      if (!rawRecords || rawRecords.length === 0) return [];

      // Group raw records by subject name
      const groupedMap = new Map<string, typeof rawRecords>();
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

      return models;
    } catch (error) {
      console.error('Error fetching statistics from db:', error);
      throw new Error('Failed to fetch statistics data');
    }
  }
}
