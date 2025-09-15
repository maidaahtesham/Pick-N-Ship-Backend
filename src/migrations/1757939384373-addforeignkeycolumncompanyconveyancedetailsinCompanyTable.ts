import { MigrationInterface, QueryRunner } from "typeorm";

export class AddforeignkeycolumncompanyconveyancedetailsinCompanyTable1757939384373 implements MigrationInterface {
    name = 'AddforeignkeycolumncompanyconveyancedetailsinCompanyTable1757939384373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."company_çonveyance_details_conveyance_types_enum" AS ENUM('bike', 'van', 'truck')`);
        await queryRunner.query(`CREATE TABLE "company_çonveyance_details" ("id" SERIAL NOT NULL, "conveyance_types" "public"."company_çonveyance_details_conveyance_types_enum" NOT NULL, "conveyance_details" text NOT NULL, "commission_rate" character varying, "commission_type" character varying, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "is_active" boolean NOT NULL, "company_id" integer, CONSTRAINT "PK_78c216cc0c1926a85fd05430dd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."company_çonveyance_pricing_details_size_enum" AS ENUM('small', 'medium', 'large')`);
        await queryRunner.query(`CREATE TABLE "company_çonveyance_pricing_details" ("pricing_id" SERIAL NOT NULL, "size" "public"."company_çonveyance_pricing_details_size_enum" NOT NULL, "weight" double precision NOT NULL, "width" double precision NOT NULL, "length" double precision NOT NULL, "height" double precision NOT NULL, "baseFare" double precision NOT NULL, "pricePerKm" double precision NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "is_active" boolean NOT NULL, "shipping_id" integer, CONSTRAINT "PK_6fb60db556b65aab160c9bc5638" PRIMARY KEY ("pricing_id"))`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_details" ADD CONSTRAINT "FK_5bbbd26c2520d04fc70c1a51823" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_pricing_details" ADD CONSTRAINT "FK_b47326ae8229a7a5ba639c2ad61" FOREIGN KEY ("shipping_id") REFERENCES "shipping_detail"("shipping_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_çonveyance_pricing_details" DROP CONSTRAINT "FK_b47326ae8229a7a5ba639c2ad61"`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_details" DROP CONSTRAINT "FK_5bbbd26c2520d04fc70c1a51823"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "company_çonveyance_pricing_details"`);
        await queryRunner.query(`DROP TYPE "public"."company_çonveyance_pricing_details_size_enum"`);
        await queryRunner.query(`DROP TABLE "company_çonveyance_details"`);
        await queryRunner.query(`DROP TYPE "public"."company_çonveyance_details_conveyance_types_enum"`);
    }

}
