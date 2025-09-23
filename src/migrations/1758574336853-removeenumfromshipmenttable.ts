import { MigrationInterface, QueryRunner } from "typeorm";

export class Removeenumfromshipmenttable1758574336853 implements MigrationInterface {
    name = 'Removeenumfromshipmenttable1758574336853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "tracking_status"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_tracking_status_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "tracking_status" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "job_status"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_job_status_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "job_status" character varying`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "job_status"`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_job_status_enum" AS ENUM('pending', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "job_status" "public"."shipment_job_status_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "tracking_status"`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_tracking_status_enum" AS ENUM('awaiting_pickup', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "tracking_status" "public"."shipment_tracking_status_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
    }

}
