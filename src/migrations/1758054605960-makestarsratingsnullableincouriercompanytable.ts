import { MigrationInterface, QueryRunner } from "typeorm";

export class Makestarsratingsnullableincouriercompanytable1758054605960 implements MigrationInterface {
    name = 'Makestarsratingsnullableincouriercompanytable1758054605960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "stars" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "createdOn" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "updatedOn" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "status" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "updatedOn" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "createdOn" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ratings" ALTER COLUMN "stars" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
    }

}
