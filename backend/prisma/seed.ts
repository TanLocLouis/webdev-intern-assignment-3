import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

// Increase connection limit for parallel inserts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL ? `${process.env.DATABASE_URL}${process.env.DATABASE_URL.includes('?') ? '&' : '?'}connection_limit=3` : undefined
    }
  }
});

const BATCH_SIZE = 10000;
const CONCURRENCY = 1;
const CSV_PATH = path.resolve(__dirname, '../../dataset/diem_thi_thpt_2024.csv');

// Convert string to float
function parseScore(val: string): number | null {
  if (!val || val.trim() === '') return null;
  const n = parseFloat(val.trim());
  return isNaN(n) ? null : n;
}

// 1. Seed Subjects
async function seedSubjects(): Promise<Map<string, number>> {
  console.log('Seeding subjects...');
  const subjectsData = [
    { name: 'Toán', code: 'toan' },
    { name: 'Ngữ văn', code: 'ngu_van' },
    { name: 'Ngoại ngữ', code: 'ngoai_ngu' },
    { name: 'Vật lí', code: 'vat_li' },
    { name: 'Hóa học', code: 'hoa_hoc' },
    { name: 'Sinh học', code: 'sinh_hoc' },
    { name: 'Lịch sử', code: 'lich_su' },
    { name: 'Địa lí', code: 'dia_li' },
    { name: 'GDCD', code: 'gdcd' },
  ];

  await prisma.subject.createMany({
    data: subjectsData,
    skipDuplicates: true,
  });

  const subjectsInDb = await prisma.subject.findMany();
  const subjectCodeToId = new Map<string, number>();
  for (const sub of subjectsInDb) {
    subjectCodeToId.set(sub.code, sub.id);
  }
  console.log(`Seeded ${subjectsInDb.length} subjects.`);
  return subjectCodeToId;
}

// Helper class for concurrent insertions with backpressure
class ConcurrentBatchInserter {
  private activeCount = 0;
  private queue: any[] = [];
  private totalInserted = 0;
  private resolveEnd: (() => void) | null = null;
  private rejectEnd: ((err: any) => void) | null = null;
  private isStreamFinished = false;
  private pendingError: any = null;

  constructor(
    private concurrency: number,
    private name: string,
    private insertFn: (chunk: any[]) => Promise<void>,
    private stream: any
  ) { }

  async push(item: any) {
    this.queue.push(item);
    if (this.queue.length >= BATCH_SIZE) {
      const chunk = this.queue.splice(0, BATCH_SIZE);
      this.runInsert(chunk);
    }
  }

  private runInsert(chunk: any[]) {
    this.activeCount++;
    if (this.activeCount >= this.concurrency) {
      this.stream.pause();
    }

    this.insertFn(chunk).then(() => {
      this.activeCount--;
      this.totalInserted += chunk.length;
      process.stdout.write(`\r   Inserted: ${this.totalInserted.toLocaleString()} ${this.name}`);

      if (this.activeCount < this.concurrency) {
        this.stream.resume();
      }

      this.checkFinished();
    }).catch((err) => {
      this.activeCount--;
      console.error(`\n[ERROR] Insert failed for ${this.name}:`, err);
      this.pendingError = err;
      this.stream.destroy();

      if (this.rejectEnd) {
        this.rejectEnd(err);
      } else {
        this.checkFinished();
      }
    });
  }

  private checkFinished() {
    if (this.isStreamFinished && this.queue.length === 0 && this.activeCount === 0) {
      if (this.pendingError) {
        if (this.rejectEnd) {
          this.rejectEnd(this.pendingError);
        }
      } else {
        if (this.resolveEnd) {
          this.resolveEnd();
        }
      }
    }
  }

  async finish(): Promise<number> {
    this.isStreamFinished = true;
    if (this.queue.length > 0) {
      const chunk = this.queue.splice(0, this.queue.length);
      this.runInsert(chunk);
    }

    await new Promise<void>((resolve, reject) => {
      this.resolveEnd = resolve;
      this.rejectEnd = reject;
      this.checkFinished();
    });

    console.log(`\nCompleted seeding ${this.name}: ${this.totalInserted.toLocaleString()} rows`);
    return this.totalInserted;
  }
}

// 2. Stream and Seed Students
async function seedStudents(): Promise<void> {
  // Using raw SQL for best performance
  console.log('Seeding students from CSV (optimized raw SQL)...');
  const stream = fs.createReadStream(CSV_PATH).pipe(parse({ columns: true, skip_empty_lines: true }));

  const insertFn = async (chunk: any[]) => {
    const values = chunk.map(c => `('${c.registration_number}', ${c.ma_ngoai_ngu ? `'${c.ma_ngoai_ngu}'` : 'NULL'})`).join(',');
    const sql = `INSERT INTO students (registration_number, ma_ngoai_ngu) VALUES ${values} ON CONFLICT (registration_number) DO NOTHING`;
    await prisma.$executeRawUnsafe(sql);
  };

  const inserter = new ConcurrentBatchInserter(CONCURRENCY, 'students', insertFn, stream);

  // Using stream to read CSV
  // Handle backpressure and errors
  await new Promise<void>((resolve, reject) => {
    stream
      .on('data', (row: Record<string, string>) => {
        const sbd = row['sbd']?.trim() ?? '';
        if (!sbd) return;

        const student = {
          registration_number: sbd,
          ma_ngoai_ngu: row['ma_ngoai_ngu']?.trim() || null,
        };

        inserter.push(student).catch(reject);
      })
      .on('end', () => {
        inserter.finish().then(() => resolve()).catch(reject);
      })
      .on('error', reject);
  });
}

// 3. Stream and Seed Scores
async function seedScores(subjectCodeToId: Map<string, number>): Promise<void> {
  console.log('Fetching student IDs from database...');
  const studentsInDb = await prisma.student.findMany({
    select: { id: true, registration_number: true },
  });

  const studentSbdToId = new Map<string, bigint>();
  for (const s of studentsInDb) {
    studentSbdToId.set(s.registration_number, s.id);
  }
  console.log(`Resolved ${studentSbdToId.size.toLocaleString()} students in memory.`);

  console.log('Seeding scores from CSV (optimized raw SQL)...');
  const stream = fs.createReadStream(CSV_PATH).pipe(parse({ columns: true, skip_empty_lines: true }));

  const insertFn = async (chunk: any[]) => {
    const values = chunk.map(c => `(${c.student_id}, ${c.subject_id}, ${c.score})`).join(',');
    const sql = `INSERT INTO scores (student_id, subject_id, score) VALUES ${values} ON CONFLICT (student_id, subject_id) DO NOTHING`;
    await prisma.$executeRawUnsafe(sql);
  };

  const inserter = new ConcurrentBatchInserter(CONCURRENCY, 'scores', insertFn, stream);

  await new Promise<void>((resolve, reject) => {
    stream
      .on('data', (row: Record<string, string>) => {
        const sbd = row['sbd']?.trim() ?? '';
        if (!sbd) return;

        const studentId = studentSbdToId.get(sbd);
        if (!studentId) return;

        // Iterate all subject codes and extract scores
        for (const [code, subjectId] of subjectCodeToId.entries()) {
          const rawScore = row[code];
          const decimalScore = parseScore(rawScore);
          if (decimalScore !== null) {
            inserter.push({
              student_id: studentId,
              subject_id: subjectId,
              score: decimalScore,
            }).catch(reject);
          }
        }
      })
      .on('end', () => {
        inserter.finish().then(() => resolve()).catch(reject);
      })
      .on('error', reject);
  });
}

async function main(): Promise<void> {
  console.log('G-Scores Redesigned Seeder starting...\n');

  // Flush old data
  console.log('Flushing existing tables...');
  await prisma.score.deleteMany();
  await prisma.student.deleteMany();
  await prisma.subject.deleteMany();
  console.log('Tables flushed.\n');

  // Seed new data
  const subjectCodeToId = await seedSubjects();
  await seedStudents();
  await seedScores(subjectCodeToId);

  console.log('\nAll seeding complete successfully!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Seeder failed:', e);
  process.exit(1);
});
