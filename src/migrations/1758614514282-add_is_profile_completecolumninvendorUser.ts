import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsProfileCompletecolumninvendorUser1758614514282 implements MigrationInterface {
    name = 'AddIsProfileCompletecolumninvendorUser1758614514282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendor_user" ADD "is_profile_complete" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "vendor_user" DROP COLUMN "is_profile_complete"`);
    }

}
