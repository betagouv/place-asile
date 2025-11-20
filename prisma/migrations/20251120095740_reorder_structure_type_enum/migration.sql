-- Temporarily convert enum columns to text
ALTER TABLE "Structure" ALTER COLUMN type TYPE text;
ALTER TABLE "StructureOfii" ALTER COLUMN type TYPE text;

-- Drop the old enum
DROP TYPE "StructureType";

-- Recreate the enum in alphabetical order
CREATE TYPE "StructureType" AS ENUM ('CADA', 'CAES', 'CPH', 'HUDA', 'NH', 'PRAHDA');

-- Convert columns back to the enum type
ALTER TABLE "Structure" ALTER COLUMN type TYPE "StructureType" USING type::"StructureType";
ALTER TABLE "StructureOfii" ALTER COLUMN type TYPE "StructureType" USING type::"StructureType";
