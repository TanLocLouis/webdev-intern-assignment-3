import { PrismaClient } from '@prisma/client';
import { StudentModel } from '../models/Student';

const prisma = new PrismaClient();

export class ScoreService {
  async getStudentBySbd(sbd: string): Promise<StudentModel | null> {
    try {
      const student = await prisma.student.findUnique({
        where: { sbd },
      });
      
      if (!student) return null;
      return new StudentModel(student);
    } catch (error) {
      console.error('Error fetching student by SBD:', error);
      throw new Error('Failed to fetch student data');
    }

  }
}
