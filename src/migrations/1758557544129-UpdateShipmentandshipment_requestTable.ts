import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateShipmentandshipmentRequestTable1758557544129 implements MigrationInterface {
    name = 'UpdateShipmentandshipmentRequestTable1758557544129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer_addresses" ("id" SERIAL NOT NULL, "street" character varying(255) NOT NULL, "city" character varying(50) NOT NULL, "country" character varying(50), "is_default" boolean NOT NULL DEFAULT false, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "status" boolean, "customer_id" integer, CONSTRAINT "PK_336bda7b0a0cd04241f719fc834" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "delivery_status"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "description" text`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_request_payment_mode_enum" AS ENUM('prepaid', 'cod')`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "payment_mode" "public"."shipment_request_payment_mode_enum" NOT NULL DEFAULT 'prepaid'`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "cod_amount" double precision`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "rejection_reason" text`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_tracking_status_enum" AS ENUM('awaiting_pickup', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "tracking_status" "public"."shipment_tracking_status_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "current_location" text`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_e904040c061f377c18a086fc8f1"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "job_status"`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_job_status_enum" AS ENUM('pending', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "job_status" "public"."shipment_job_status_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "REL_e904040c061f377c18a086fc8f"`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" ADD CONSTRAINT "FK_6be4e1a698f5c3f2c2e4c75c186" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_e904040c061f377c18a086fc8f1" FOREIGN KEY ("request_id") REFERENCES "shipment_request"("request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_e904040c061f377c18a086fc8f1"`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" DROP CONSTRAINT "FK_6be4e1a698f5c3f2c2e4c75c186"`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "REL_e904040c061f377c18a086fc8f" UNIQUE ("request_id")`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "job_status"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_job_status_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "job_status" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_e904040c061f377c18a086fc8f1" FOREIGN KEY ("request_id") REFERENCES "shipment_request"("request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "current_location"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "tracking_status"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_tracking_status_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "rejection_reason"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "cod_amount"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "payment_mode"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_request_payment_mode_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "delivery_status" character varying`);
        await queryRunner.query(`DROP TABLE "customer_addresses"`);
    }

}
