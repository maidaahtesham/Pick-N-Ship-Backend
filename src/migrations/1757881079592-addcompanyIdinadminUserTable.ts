import { MigrationInterface, QueryRunner } from "typeorm";

export class AddcompanyIdinadminUserTable1757881079592 implements MigrationInterface {
    name = 'AddcompanyIdinadminUserTable1757881079592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "super_admin" ADD "company_id" integer`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "super_admin" ADD CONSTRAINT "FK_468ef9cc97dbb0e43cfc3f80054" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "super_admin" DROP CONSTRAINT "FK_468ef9cc97dbb0e43cfc3f80054"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "super_admin" DROP COLUMN "company_id"`);
    }

}
