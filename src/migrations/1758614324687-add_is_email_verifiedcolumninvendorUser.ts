import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsEmailVerifiedcolumninvendorUser1758614324687 implements MigrationInterface {
    name = 'AddIsEmailVerifiedcolumninvendorUser1758614324687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendor_user" ADD "is_email_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "vendor_user" ADD CONSTRAINT "UQ_b173d8c2788aea2606e93f88da4" UNIQUE ("email_address")`);
        await queryRunner.query(`ALTER TABLE "vendor_user" ADD CONSTRAINT "UQ_831949a5cf6bfad264171b43b93" UNIQUE ("phone_number")`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "vendor_user" DROP CONSTRAINT "UQ_831949a5cf6bfad264171b43b93"`);
        await queryRunner.query(`ALTER TABLE "vendor_user" DROP CONSTRAINT "UQ_b173d8c2788aea2606e93f88da4"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "vendor_user" DROP COLUMN "is_email_verified"`);
    }

}
