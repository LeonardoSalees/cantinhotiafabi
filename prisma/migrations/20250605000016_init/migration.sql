/*
  Warnings:

  - The primary key for the `Extra` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_ExtraToOrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_ExtraToProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "_ExtraToOrderItem" DROP CONSTRAINT "_ExtraToOrderItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExtraToOrderItem" DROP CONSTRAINT "_ExtraToOrderItem_B_fkey";

-- DropForeignKey
ALTER TABLE "_ExtraToProduct" DROP CONSTRAINT "_ExtraToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExtraToProduct" DROP CONSTRAINT "_ExtraToProduct_B_fkey";

-- AlterTable
ALTER TABLE "Extra" DROP CONSTRAINT "Extra_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Extra_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Extra_id_seq";

-- AlterTable
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OrderItem_id_seq";

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_id_seq";

-- AlterTable
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Settings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_ExtraToOrderItem" DROP CONSTRAINT "_ExtraToOrderItem_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_ExtraToOrderItem_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "_ExtraToProduct" DROP CONSTRAINT "_ExtraToProduct_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_ExtraToProduct_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraToProduct" ADD CONSTRAINT "_ExtraToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Extra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraToProduct" ADD CONSTRAINT "_ExtraToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraToOrderItem" ADD CONSTRAINT "_ExtraToOrderItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Extra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraToOrderItem" ADD CONSTRAINT "_ExtraToOrderItem_B_fkey" FOREIGN KEY ("B") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
