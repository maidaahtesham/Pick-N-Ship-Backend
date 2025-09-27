import { MigrationInterface, QueryRunner } from "typeorm";

export class Addshipmentcreatedoncolumninshipmentandparceldetailtable1758919250075 implements MigrationInterface {
    name = 'Addshipmentcreatedoncolumninshipmentandparceldetailtable1758919250075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_details" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "shipment_created_on" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "shipment_created_on"`);
        await queryRunner.query(`ALTER TABLE "parcel_details" DROP COLUMN "description"`);
    }

}
