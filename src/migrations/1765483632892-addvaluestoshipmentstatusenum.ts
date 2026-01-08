import { MigrationInterface, QueryRunner } from "typeorm";

export class Addvaluestoshipmentstatusenum1765483632892 implements MigrationInterface {
    name = 'Addvaluestoshipmentstatusenum1765483632892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."shipment_shipment_status_enum" RENAME TO "shipment_shipment_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_shipment_status_enum" AS ENUM('pending', 'accepted', 'declined', 'assigned', 'in_progress', 'completed')`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "shipment_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "shipment_status" TYPE "public"."shipment_shipment_status_enum" USING "shipment_status"::"text"::"public"."shipment_shipment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "shipment_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."shipment_shipment_status_enum_old"`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`CREATE TYPE "public"."shipment_shipment_status_enum_old" AS ENUM('pending', 'accepted', 'declined')`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "shipment_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "shipment_status" TYPE "public"."shipment_shipment_status_enum_old" USING "shipment_status"::"text"::"public"."shipment_shipment_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "shipment_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."shipment_shipment_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."shipment_shipment_status_enum_old" RENAME TO "shipment_shipment_status_enum"`);
          }

}
