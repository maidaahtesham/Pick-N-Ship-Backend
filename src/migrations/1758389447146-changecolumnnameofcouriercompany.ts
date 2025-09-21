import { MigrationInterface, QueryRunner } from "typeorm";

export class Changecolumnnameofcouriercompany1758389447146 implements MigrationInterface {
    name = 'Changecolumnnameofcouriercompany1758389447146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rider" RENAME COLUMN "id" TO "rider_id"`);
        await queryRunner.query(`ALTER TABLE "rider" RENAME CONSTRAINT "PK_1ed6540e613592e2a470a162ef1" TO "PK_a14584b1df696762eb113647a14"`);
        await queryRunner.query(`ALTER SEQUENCE "rider_id_seq" RENAME TO "rider_rider_id_seq"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER SEQUENCE "rider_rider_id_seq" RENAME TO "rider_id_seq"`);
        await queryRunner.query(`ALTER TABLE "rider" RENAME CONSTRAINT "PK_a14584b1df696762eb113647a14" TO "PK_1ed6540e613592e2a470a162ef1"`);
        await queryRunner.query(`ALTER TABLE "rider" RENAME COLUMN "rider_id" TO "id"`);
    }

}
