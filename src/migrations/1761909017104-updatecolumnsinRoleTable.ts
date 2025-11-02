import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatecolumnsinRoleTable1761909017104 implements MigrationInterface {
    name = 'UpdatecolumnsinRoleTable1761909017104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "created_on"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updated_on"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "createdOn" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "updatedOn" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "createdBy" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "updatedBy" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "status" DROP DEFAULT`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updatedOn"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "createdOn"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "updated_by" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "created_by" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "updated_on" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "created_on" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
