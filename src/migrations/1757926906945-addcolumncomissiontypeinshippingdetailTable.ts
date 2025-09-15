import { MigrationInterface, QueryRunner } from "typeorm";

export class AddcolumncomissiontypeinshippingdetailTable1757926906945 implements MigrationInterface {
    name = 'AddcolumncomissiontypeinshippingdetailTable1757926906945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping_detail" ADD "commission_type" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" DROP COLUMN "commission_type"`);
    }

}
