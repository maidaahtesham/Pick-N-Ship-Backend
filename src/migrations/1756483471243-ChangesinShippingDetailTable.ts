import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangesinShippingDetailTable1756483471243 implements MigrationInterface {
    name = 'ChangesinShippingDetailTable1756483471243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping_detail" ADD "createdBy" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" ADD "updatedBy" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" ADD "is_active" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" DROP COLUMN "createdBy"`);
    }

}
