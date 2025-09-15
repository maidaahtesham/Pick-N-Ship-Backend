import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableShippingPricingandAddColumnsinShippingdetails1757923641996 implements MigrationInterface {
    name = 'AddTableShippingPricingandAddColumnsinShippingdetails1757923641996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."shipping_pricing_size_enum" AS ENUM('small', 'medium', 'large')`);
        await queryRunner.query(`CREATE TABLE "shipping_pricing" ("pricing_id" SERIAL NOT NULL, "size" "public"."shipping_pricing_size_enum" NOT NULL, "weight" double precision NOT NULL, "width" double precision NOT NULL, "length" double precision NOT NULL, "height" double precision NOT NULL, "baseFare" double precision NOT NULL, "pricePerKm" double precision NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "is_active" boolean NOT NULL, "shipping_id" integer, CONSTRAINT "PK_0cf364019d853b6e296f1be5818" PRIMARY KEY ("pricing_id"))`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" DROP COLUMN "commission_rate"`);
        await queryRunner.query(`DROP TYPE "public"."shipping_detail_commission_rate_enum"`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" ADD "commission_rate" character varying`);
        await queryRunner.query(`ALTER TABLE "shipping_pricing" ADD CONSTRAINT "FK_6379ad0c513175cb3f101392227" FOREIGN KEY ("shipping_id") REFERENCES "shipping_detail"("shipping_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping_pricing" DROP CONSTRAINT "FK_6379ad0c513175cb3f101392227"`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" DROP COLUMN "commission_rate"`);
        await queryRunner.query(`CREATE TYPE "public"."shipping_detail_commission_rate_enum" AS ENUM('standard', '10%', '5%', 'custom')`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" ADD "commission_rate" "public"."shipping_detail_commission_rate_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "shipping_pricing"`);
        await queryRunner.query(`DROP TYPE "public"."shipping_pricing_size_enum"`);
    }

}
