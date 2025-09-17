import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedatatypeofstarcolumninratingTable1758114034229 implements MigrationInterface {
    name = 'ChangedatatypeofstarcolumninratingTable1758114034229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "stars"`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD "stars" numeric(5,2)`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "stars"`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD "stars" integer`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
    }

}
