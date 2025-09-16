import { MigrationInterface, QueryRunner } from "typeorm";

export class Makeratingsnullableincouriercompanytable1758052475335 implements MigrationInterface {
    name = 'Makeratingsnullableincouriercompanytable1758052475335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
       await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "rider_behavior_score" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "on_time_delivery_score" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "affordability_score" DROP NOT NULL`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
     await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "affordability_score" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "on_time_delivery_score" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "rider_behavior_score" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" DROP DEFAULT`);   }

}
