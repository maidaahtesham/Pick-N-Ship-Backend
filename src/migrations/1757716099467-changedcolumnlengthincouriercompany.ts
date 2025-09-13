import { MigrationInterface, QueryRunner } from "typeorm";

export class Changedcolumnlengthincouriercompany1757716099467 implements MigrationInterface {
    name = 'Changedcolumnlengthincouriercompany1757716099467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "courier_company" DROP COLUMN "company_email_address"`);
        await queryRunner.query(`ALTER TABLE "courier_company" ADD "company_email_address" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "courier_company" DROP COLUMN "pns_account_full_name"`);
        await queryRunner.query(`ALTER TABLE "courier_company" ADD "pns_account_full_name" character varying(200)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courier_company" DROP COLUMN "pns_account_full_name"`);
        await queryRunner.query(`ALTER TABLE "courier_company" ADD "pns_account_full_name" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "courier_company" DROP COLUMN "company_email_address"`);
        await queryRunner.query(`ALTER TABLE "courier_company" ADD "company_email_address" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
    }

}
