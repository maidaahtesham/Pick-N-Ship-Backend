import { MigrationInterface, QueryRunner } from "typeorm";

export class Makecompanyidnullableincustomer1758710121641 implements MigrationInterface {
    name = 'Makecompanyidnullableincustomer1758710121641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_170a73f2523d7ca266834e38ef1"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "UQ_fdb2f3ad8115da4c7718109a6eb" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "UQ_998bb43a16f512608c017301523" UNIQUE ("phone_number")`);
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "company_id" DROP NOT NULL`);
         await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_170a73f2523d7ca266834e38ef1" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_170a73f2523d7ca266834e38ef1"`);
         await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "company_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "UQ_998bb43a16f512608c017301523"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "UQ_fdb2f3ad8115da4c7718109a6eb"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_170a73f2523d7ca266834e38ef1" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
    }

}
