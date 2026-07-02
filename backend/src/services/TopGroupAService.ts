import { PrismaClient } from '@prisma/client';
import { topGroupAModel } from '../models/TopGroupAModel';

const prisma = new PrismaClient();

export class TopGroupAService {
  async getTopGroupA(limit: number = 10): Promise<topGroupAModel[]> {
    try {
      const students = await prisma.topGroupA.findMany({
        where: {
          total_score: {
            not: null,
          },
        },
        orderBy: { total_score: 'desc' },
        take: limit,
      });

      if (!students || students.length === 0) return [];

      // console.log("[DEBUG]: Fetched top group A students:", students);

      return students.map((student) => new topGroupAModel(student));
    } catch (error) {
      console.error('Error fetching top group A students in TopGroupAService:', error);
      throw new Error('Failed to fetch top group A students');
    }
  }
}
