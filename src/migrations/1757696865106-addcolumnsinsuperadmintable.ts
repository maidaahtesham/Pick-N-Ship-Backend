import { MigrationInterface, QueryRunner } from "typeorm";

export class Addcolumnsinsuperadmintable1757696865106 implements MigrationInterface {
    name = 'Addcolumnsinsuperadmintable1757696865106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "super_admin" ADD "role" character varying(250) NULL`);
        await queryRunner.query(`ALTER TABLE "super_admin" ADD "createdOn" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "super_admin" ADD "updatedOn" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "super_admin" ADD "createdBy" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "super_admin" ADD "updatedBy" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "super_admin" ADD "is_active" boolean`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "super_admin" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "super_admin" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "super_admin" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "super_admin" DROP COLUMN "updatedOn"`);
        await queryRunner.query(`ALTER TABLE "super_admin" DROP COLUMN "createdOn"`);
        await queryRunner.query(`ALTER TABLE "super_admin" DROP COLUMN "role"`);
    }

}
