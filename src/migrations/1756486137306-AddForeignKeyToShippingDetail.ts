import { MigrationInterface, QueryRunner } from "typeorm";

export class AddForeignKeyToShippingDetail1756486137306 implements MigrationInterface {
    name = 'AddForeignKeyToShippingDetail1756486137306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" DROP CONSTRAINT "FK_634f7b52064ba0236ad13473cb5"`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" ALTER COLUMN "company_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" ADD CONSTRAINT "FK_634f7b52064ba0236ad13473cb5" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping_detail" DROP CONSTRAINT "FK_634f7b52064ba0236ad13473cb5"`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" ALTER COLUMN "company_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" ADD CONSTRAINT "FK_634f7b52064ba0236ad13473cb5" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
    }

}
