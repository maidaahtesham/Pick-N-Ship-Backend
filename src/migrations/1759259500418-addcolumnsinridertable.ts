import { MigrationInterface, QueryRunner } from "typeorm";

export class Addcolumnsinridertable1759259500418 implements MigrationInterface {
    name = 'Addcolumnsinridertable1759259500418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rider" DROP COLUMN "assigned_jobs"`);
        await queryRunner.query(`ALTER TABLE "rider" ADD "is_job_assigned" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "rider" ADD "is_available" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "rider" ADD "profile_status" character varying DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "rider" DROP COLUMN "availability_status"`);
        await queryRunner.query(`ALTER TABLE "rider" ADD "availability_status" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "rider" DROP COLUMN "availability_status"`);
        await queryRunner.query(`ALTER TABLE "rider" ADD "availability_status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rider" DROP COLUMN "profile_status"`);
        await queryRunner.query(`ALTER TABLE "rider" DROP COLUMN "is_available"`);
        await queryRunner.query(`ALTER TABLE "rider" DROP COLUMN "is_job_assigned"`);
        await queryRunner.query(`ALTER TABLE "rider" ADD "assigned_jobs" integer NOT NULL`);
    }

}
