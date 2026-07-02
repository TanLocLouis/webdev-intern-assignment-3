import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

const BATCH_SIZE = 1000;
const CSV_PATH = path.resolve(__dirname, '../../dataset/diem_thi_thpt_2024.csv');

// Convert string to float
function parseScore(val: string): Prisma.Decimal | null {
  if (!val || val.trim() === '') return null;

  const n = parseFloat(val.trim());
  return isNaN(n) ? null : new Prisma.Decimal(n);
}

// Get band base on score number
function getBand(score: number): string {
  if (score >= 8) return '>=8';
  if (score >= 6) return '[6,8)';
  if (score >= 4) return '[4,6)';
  return '<4';
}

// Calculate group A score
function calculateGroupAScore(student: Record<string, Prisma.Decimal | null>): Prisma.Decimal | null {
  const toan = student['toan'];
  const vat_li = student['vat_li'];
  const hoa_hoc = student['hoa_hoc'];

  if (toan === null || vat_li === null || hoa_hoc === null) return null;

  return toan.add(vat_li).add(hoa_hoc);
}

// Main function to seed student
async function seedStudents(): Promise<void> {
  console.log('Starting student seeding from CSV...');

  const subjects = ['toan', 'ngu_van', 'ngoai_ngu', 'vat_li', 'hoa_hoc', 'sinh_hoc', 'lich_su', 'dia_li', 'gdcd'] as const;
  const bands = ['>=8', '[6,8)', '[4,6)', '<4'] as const;

  let batch: Prisma.StudentCreateManyInput[] = [];
  let top_group_a_batch: Prisma.TopGroupACreateManyInput[] = [];

  let totalInserted = 0;

  const stream = fs.createReadStream(CSV_PATH).pipe(parse({ columns: true, skip_empty_lines: true }));

  // Insert a batch into DB. Called with stream already paused.
  const processBatch = async () => {
    // Insert to score table
    if (batch.length === 0) return;
    const current = batch;
    batch = [];
    await prisma.student.createMany({ data: current, skipDuplicates: true });
    totalInserted += current.length;
    process.stdout.write(`\r   Inserted: ${totalInserted.toLocaleString()} rows`);

    // Insert to score statistic table
    // In-memory statistic aggregation for this batch
    const batchStats: Record<string, Record<string, number>> = {};
    for (const sub of subjects) {
      batchStats[sub] = { '>=8': 0, '[6,8)': 0, '[4,6)': 0, '<4': 0 };
    }

    for (const record of current) {
      for (const subject of subjects) {
        const score = record[subject];
        if (score !== null && score !== undefined) {
          const band = getBand(Number(score));
          batchStats[subject][band]++;
        }
      }
    }

    // Incremental database upserts for the batch statistics (max 36 queries per batch)
    for (const subject of subjects) {
      for (const band of bands) {
        const count = batchStats[subject][band];
        if (count > 0) {
          await prisma.scoreStatistic.upsert({
            where: { subject_band: { subject, band } },
            update: { count: { increment: count } },
            create: { subject, band, count },
          });
        }
      }
    }

  };
  const processTopGroupABatch = async () => {
    // Insert to top Group A table
    if (top_group_a_batch.length === 0) return;
    const current = top_group_a_batch;
    top_group_a_batch = [];
    await prisma.topGroupA.createMany({ data: current, skipDuplicates: true });
  };

  await new Promise<void>((resolve, reject) => {
    stream
      .on('data', (row: Record<string, string>) => {
        const record: Prisma.StudentCreateManyInput = {
          sbd: row['sbd']?.trim() ?? '',
          toan: parseScore(row['toan']),
          ngu_van: parseScore(row['ngu_van']),
          ngoai_ngu: parseScore(row['ngoai_ngu']),
          vat_li: parseScore(row['vat_li']),
          hoa_hoc: parseScore(row['hoa_hoc']),
          sinh_hoc: parseScore(row['sinh_hoc']),
          lich_su: parseScore(row['lich_su']),
          dia_li: parseScore(row['dia_li']),
          gdcd: parseScore(row['gdcd']),
          ma_ngoai_ngu: row['ma_ngoai_ngu']?.trim() || null,
        };
        const top_group_a_record: Prisma.TopGroupACreateManyInput = {
          sbd: row['sbd']?.trim() ?? '',
          toan: parseScore(row['toan']),
          vat_li: parseScore(row['vat_li']),
          hoa_hoc: parseScore(row['hoa_hoc']),
          total_score: calculateGroupAScore({
            toan: parseScore(row['toan']),
            vat_li: parseScore(row['vat_li']),
            hoa_hoc: parseScore(row['hoa_hoc']),
          }),
        };

        // Skip student if sbd is invalid
        if (!record.sbd) return;
        if (!top_group_a_record.sbd) return;

        // push record into batch
        batch.push(record);
        top_group_a_batch.push(top_group_a_record);

        if (batch.length >= BATCH_SIZE) {
          // Pause the stream when the the DB is inserting.
          stream.pause();
          processBatch()
            .then(() => stream.resume())
            .catch((err: Error) => {
              stream.destroy();
              reject(err);
            });

          stream.pause();
          processTopGroupABatch()
            .then(() => stream.resume())
            .catch((err: Error) => {
              stream.destroy();
              reject(err);
            });
        }
      })
      .on('end', async () => {
        await processBatch(); // Flush remaining
        await processTopGroupABatch(); // Flush remaining

        console.log(`\nStudents seeded: ${totalInserted.toLocaleString()} rows`);
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function main(): Promise<void> {
  console.log('G-Scores Seeder starting...\n');

  // Clear old data
  console.log('Flushing existing students table...');
  await prisma.student.deleteMany();
  await prisma.topGroupA.deleteMany();
  await prisma.scoreStatistic.deleteMany();
  console.log('Table flushed.\n');

  // Seed new data
  await seedStudents();
  console.log('\nAll seeding complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Seeder failed:', e);
  process.exit(1);
});
