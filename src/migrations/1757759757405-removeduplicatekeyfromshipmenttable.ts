import { MigrationInterface, QueryRunner } from "typeorm";

export class Removeduplicatekeyfromshipmenttable1757759757405 implements MigrationInterface {
    name = 'Removeduplicatekeyfromshipmenttable1757759757405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "courier_company_id"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "courier_company_id" integer NOT NULL`);
    }

}
