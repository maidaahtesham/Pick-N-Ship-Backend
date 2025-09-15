import { MigrationInterface, QueryRunner } from "typeorm";

export class Correctingrelationamongcompanyconyanceandpricing1757945851895 implements MigrationInterface {
    name = 'Correctingrelationamongcompanyconyanceandpricing1757945851895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_çonveyance_pricing_details" DROP CONSTRAINT "FK_b47326ae8229a7a5ba639c2ad61"`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_pricing_details" RENAME COLUMN "shipping_id" TO "conveyance_id"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_pricing_details" ADD CONSTRAINT "FK_52bf81db958116fb102c1dafc3c" FOREIGN KEY ("conveyance_id") REFERENCES "company_çonveyance_details"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_çonveyance_pricing_details" DROP CONSTRAINT "FK_52bf81db958116fb102c1dafc3c"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_pricing_details" RENAME COLUMN "conveyance_id" TO "shipping_id"`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_pricing_details" ADD CONSTRAINT "FK_b47326ae8229a7a5ba639c2ad61" FOREIGN KEY ("shipping_id") REFERENCES "shipping_detail"("shipping_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
