import { MigrationInterface, QueryRunner } from "typeorm";

export class AdddropOfflocationinshipmentRequesttable1758831472191 implements MigrationInterface {
    name = 'AdddropOfflocationinshipmentRequesttable1758831472191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "dropoff_location" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "dropoff_location"`);
    }

}
