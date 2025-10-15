/*
  Warnings:

  - A unique constraint covering the columns `[strokeId]` on the table `Stroke` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stroke_strokeId_key" ON "public"."Stroke"("strokeId");
