import { MigrationInterface, QueryRunner } from "typeorm";

export class AddForeignKeyToCustomerTable1756490031826 implements MigrationInterface {
    name = 'AddForeignKeyToCustomerTable1756490031826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_17d4730a5cbe931bc72d83d417d"`);
        await queryRunner.query(`ALTER TABLE "customer" RENAME COLUMN "courier_company_id" TO "company_id"`);
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "company_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_170a73f2523d7ca266834e38ef1" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_170a73f2523d7ca266834e38ef1"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "company_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" RENAME COLUMN "company_id" TO "courier_company_id"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_17d4730a5cbe931bc72d83d417d" FOREIGN KEY ("courier_company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
