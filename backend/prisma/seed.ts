import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

const BATCH_SIZE = 5000;
const CSV_PATH = path.resolve(__dirname, '../../dataset/diem_thi_thpt_2024.csv');

// Convert string to float
function parseScore(val: string): Prisma.Decimal | null {
  if (!val || val.trim() === '') return null;

  const n = parseFloat(val.trim());
  return isNaN(n) ? null : new Prisma.Decimal(n);
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

  const queue: { student: Prisma.StudentCreateManyInput; topGroupA: Prisma.TopGroupACreateManyInput }[] = [];
  let totalInserted = 0;
  let isProcessing = false;

  const stream = fs.createReadStream(CSV_PATH).pipe(parse({ columns: true, skip_empty_lines: true }));

  await new Promise<void>((resolve, reject) => {
    // Helper to process queue sequentially
    const processQueue = async () => {
      if (isProcessing) return;
      isProcessing = true;

      try {
        while (queue.length >= BATCH_SIZE) {
          const chunk = queue.splice(0, BATCH_SIZE);
          const students = chunk.map(item => item.student);
          const topGroupAs = chunk.map(item => item.topGroupA);

          // Run them concurrently for the same chunk to utilize database throughput safely
          await Promise.all([
            prisma.student.createMany({ data: students, skipDuplicates: true }),
            prisma.topGroupA.createMany({ data: topGroupAs, skipDuplicates: true }),
          ]);

          totalInserted += chunk.length;
          process.stdout.write(`\r   Inserted: ${totalInserted.toLocaleString()} rows`);
        }
      } catch (err) {
        stream.destroy();
        reject(err);
        return;
      } finally {
        isProcessing = false;
        // Resume stream if queue is drained below batch threshold
        if (queue.length < BATCH_SIZE) {
          stream.resume();
        }
      }
    };

    stream
      .on('data', (row: Record<string, string>) => {
        const student: Prisma.StudentCreateManyInput = {
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

        const topGroupA: Prisma.TopGroupACreateManyInput = {
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

        if (!student.sbd || !topGroupA.sbd) return;

        queue.push({ student, topGroupA });

        if (queue.length >= BATCH_SIZE) {
          stream.pause();
          processQueue().catch(reject);
        }
      })
      .on('end', async () => {
        // Wait for any active processing to finish
        while (isProcessing) {
          await new Promise(r => setTimeout(r, 100));
        }

        // Process any remaining items
        try {
          while (queue.length > 0) {
            const chunk = queue.splice(0, BATCH_SIZE);
            const students = chunk.map(item => item.student);
            const topGroupAs = chunk.map(item => item.topGroupA);

            await Promise.all([
              prisma.student.createMany({ data: students, skipDuplicates: true }),
              prisma.topGroupA.createMany({ data: topGroupAs, skipDuplicates: true }),
            ]);

            totalInserted += chunk.length;
            process.stdout.write(`\r   Inserted: ${totalInserted.toLocaleString()} rows`);
          }
          console.log(`\nStudents seeded: ${totalInserted.toLocaleString()} rows`);
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// Function to calculate and seed score statistics
async function seedScoreStatistics(): Promise<void> {
  console.log('\nCalculating score statistics from database...');

  const subjects = ['toan', 'ngu_van', 'ngoai_ngu', 'vat_li', 'hoa_hoc', 'sinh_hoc', 'lich_su', 'dia_li', 'gdcd'] as const;

  const queries = subjects.map(subject => `
    SELECT 
      '${subject}' AS subject,
      CASE 
        WHEN "${subject}" >= 8 THEN '>=8'
        WHEN "${subject}" >= 6 THEN '[6,8)'
        WHEN "${subject}" >= 4 THEN '[4,6)'
        ELSE '<4'
      END AS band,
      COUNT(*)::int AS count
    FROM students
    WHERE "${subject}" IS NOT NULL
    GROUP BY 
      CASE 
        WHEN "${subject}" >= 8 THEN '>=8'
        WHEN "${subject}" >= 6 THEN '[6,8)'
        WHEN "${subject}" >= 4 THEN '[4,6)'
        ELSE '<4'
      END
  `);

  const unionQuery = queries.join('\nUNION ALL\n');

  const statsData = await prisma.$queryRawUnsafe<{ subject: string; band: string; count: number }[]>(unionQuery);

  console.log('Saving score statistics...');
  if (statsData.length > 0) {
    await prisma.scoreStatistic.createMany({ data: statsData });
  }
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
  await seedScoreStatistics();
  console.log('\nAll seeding complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Seeder failed:', e);
  process.exit(1);
});
