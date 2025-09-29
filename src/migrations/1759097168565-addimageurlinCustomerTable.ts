import { MigrationInterface, QueryRunner } from "typeorm";

export class AddimageurlinCustomerTable1759097168565 implements MigrationInterface {
    name = 'AddimageurlinCustomerTable1759097168565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "profile_image_url" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "profile_image_url"`);
    }

}
