import { MigrationInterface, QueryRunner } from "typeorm";

export class AddaddressTypefieldsinCustomerAddressesTables1758682365441 implements MigrationInterface {
    name = 'AddaddressTypefieldsinCustomerAddressesTables1758682365441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_addresses" ADD "address_type" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" DROP COLUMN "address_type"`);
    }

}
