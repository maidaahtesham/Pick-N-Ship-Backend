import { MigrationInterface, QueryRunner } from "typeorm";

export class AddfieldsinCustomerAddressesTables1758682175407 implements MigrationInterface {
    name = 'AddfieldsinCustomerAddressesTables1758682175407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_addresses" ADD "building_name" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" ADD "apartment" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" ADD "makani_number" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" ADD "nearest_landmark" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" DROP COLUMN "nearest_landmark"`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" DROP COLUMN "makani_number"`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" DROP COLUMN "apartment"`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" DROP COLUMN "building_name"`);
    }

}
