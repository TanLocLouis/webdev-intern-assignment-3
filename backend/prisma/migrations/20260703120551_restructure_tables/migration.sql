/*
  Warnings:

  - The primary key for the `students` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dia_li` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `gdcd` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `hoa_hoc` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `lich_su` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `ngoai_ngu` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `ngu_van` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `sbd` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `sinh_hoc` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `toan` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `vat_li` on the `students` table. All the data in the column will be lost.
  - You are about to drop the `score_statistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `top_group_a` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[registration_number]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registration_number` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "students_sbd_idx";

-- DropIndex
DROP INDEX "students_sbd_key";

-- AlterTable
ALTER TABLE "students" DROP CONSTRAINT "students_pkey",
DROP COLUMN "dia_li",
DROP COLUMN "gdcd",
DROP COLUMN "hoa_hoc",
DROP COLUMN "lich_su",
DROP COLUMN "ngoai_ngu",
DROP COLUMN "ngu_van",
DROP COLUMN "sbd",
DROP COLUMN "sinh_hoc",
DROP COLUMN "toan",
DROP COLUMN "vat_li",
ADD COLUMN     "registration_number" VARCHAR(20) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "score_statistics";

-- DropTable
DROP TABLE "top_group_a";

-- CreateTable
CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "code" VARCHAR(10) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "id" BIGSERIAL NOT NULL,
    "student_id" BIGINT NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "score" DECIMAL(4,2) NOT NULL,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");

-- CreateIndex
CREATE UNIQUE INDEX "scores_student_id_subject_id_key" ON "scores"("student_id", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_registration_number_key" ON "students"("registration_number");

-- CreateIndex
CREATE INDEX "students_registration_number_idx" ON "students"("registration_number");

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
