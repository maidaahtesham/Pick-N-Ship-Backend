import { MigrationInterface, QueryRunner } from "typeorm";

export class Addcommissiontypeincouriercompanytable1757959374412 implements MigrationInterface {
    name = 'Addcommissiontypeincouriercompanytable1757959374412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_çonveyance_details" DROP COLUMN "commission_rate"`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_details" DROP COLUMN "commission_type"`);
        await queryRunner.query(`CREATE TYPE "public"."courier_company_commission_type_enum" AS ENUM('standard', 'sme', 'custom')`);
        await queryRunner.query(`ALTER TABLE "courier_company" ADD "commission_type" "public"."courier_company_commission_type_enum" NOT NULL DEFAULT 'standard'`);
        await queryRunner.query(`ALTER TABLE "courier_company" ADD "commission_rate" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "courier_company" DROP COLUMN "commission_rate"`);
        await queryRunner.query(`ALTER TABLE "courier_company" DROP COLUMN "commission_type"`);
        await queryRunner.query(`DROP TYPE "public"."courier_company_commission_type_enum"`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_details" ADD "commission_type" character varying`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_details" ADD "commission_rate" character varying`);
    }

}
