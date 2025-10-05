import { MigrationInterface, QueryRunner } from "typeorm";

export class Addcolumnincustomeraddress1759313924098 implements MigrationInterface {
    name = 'Addcolumnincustomeraddress1759313924098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_addresses" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" DROP COLUMN "address"`);
    }

}
