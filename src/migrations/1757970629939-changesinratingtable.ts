import { MigrationInterface, QueryRunner } from "typeorm";

export class Changesinratingtable1757970629939 implements MigrationInterface {
    name = 'Changesinratingtable1757970629939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "rider_behavior_score"`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD "rider_behavior_score" numeric(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "on_time_delivery_score"`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD "on_time_delivery_score" numeric(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "affordability_score"`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD "affordability_score" numeric(5,2) NULL`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "affordability_score"`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD "affordability_score" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "on_time_delivery_score"`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD "on_time_delivery_score" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "rider_behavior_score"`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD "rider_behavior_score" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
    }

}
