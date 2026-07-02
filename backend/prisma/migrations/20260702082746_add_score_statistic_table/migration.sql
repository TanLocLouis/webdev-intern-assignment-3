-- CreateTable
CREATE TABLE "score_statistics" (
    "id" SERIAL NOT NULL,
    "subject" VARCHAR(20) NOT NULL,
    "band" VARCHAR(10) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "score_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "score_statistics_subject_band_key" ON "score_statistics"("subject", "band");
