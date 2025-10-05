import { MigrationInterface, QueryRunner } from "typeorm";

export class AddcolumnisreviewedinShipmentTable1759431885031 implements MigrationInterface {
    name = 'AddcolumnisreviewedinShipmentTable1759431885031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment" ADD "is_reviewed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "is_reviewed"`);
    }

}
