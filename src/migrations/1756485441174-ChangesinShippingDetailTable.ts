import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangesinShippingDetailTable1756485441174 implements MigrationInterface {
    name = 'ChangesinShippingDetailTable1756485441174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shipping_detail" ("shipping_id" SERIAL NOT NULL, "company_id" integer NOT NULL, "conveyance_types" "public"."shipping_detail_conveyance_types_enum" NOT NULL, "conveyance_details" text NOT NULL, "commission_rate" "public"."shipping_detail_commission_rate_enum" NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "is_active" boolean NOT NULL, CONSTRAINT "PK_6b88b9b0bd94e7739c5257a3e17" PRIMARY KEY ("shipping_id"))`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" ADD CONSTRAINT "FK_634f7b52064ba0236ad13473cb5" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_5e6d0e0265f57d68c2bacb07c73" FOREIGN KEY ("shipping_id") REFERENCES "shipping_detail"("shipping_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_5e6d0e0265f57d68c2bacb07c73"`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" DROP CONSTRAINT "FK_634f7b52064ba0236ad13473cb5"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "shipping_detail"`);
    }

}
