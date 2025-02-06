-- AlterTable
ALTER TABLE "Prodcut" ADD COLUMN     "orderId" INTEGER;

-- AddForeignKey
ALTER TABLE "Prodcut" ADD CONSTRAINT "Prodcut_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
