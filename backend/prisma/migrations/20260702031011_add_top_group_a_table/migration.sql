-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "sbd" CHAR(8) NOT NULL,
    "toan" DECIMAL(4,2),
    "ngu_van" DECIMAL(4,2),
    "ngoai_ngu" DECIMAL(4,2),
    "vat_li" DECIMAL(4,2),
    "hoa_hoc" DECIMAL(4,2),
    "sinh_hoc" DECIMAL(4,2),
    "lich_su" DECIMAL(4,2),
    "dia_li" DECIMAL(4,2),
    "gdcd" DECIMAL(4,2),
    "ma_ngoai_ngu" VARCHAR(4),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "top_group_a" (
    "id" SERIAL NOT NULL,
    "sbd" CHAR(8) NOT NULL,
    "toan" DECIMAL(4,2),
    "vat_li" DECIMAL(4,2),
    "hoa_hoc" DECIMAL(4,2),
    "total_score" DECIMAL(4,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "top_group_a_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_sbd_key" ON "students"("sbd");

-- CreateIndex
CREATE INDEX "students_sbd_idx" ON "students"("sbd");

-- CreateIndex
CREATE UNIQUE INDEX "top_group_a_sbd_key" ON "top_group_a"("sbd");

-- CreateIndex
CREATE INDEX "top_group_a_sbd_idx" ON "top_group_a"("sbd");
