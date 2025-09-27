import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatetableparcelDetails1758829848388 implements MigrationInterface {
    name = 'CreatetableparcelDetails1758829848388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."parcel_details_package_size_enum" AS ENUM('small', 'medium', 'large')`);
        await queryRunner.query(`CREATE TABLE "parcel_details" ("parcel_id" SERIAL NOT NULL, "dropoff_location" character varying(255), "receiver_name" character varying NOT NULL, "receiver_phone" character varying NOT NULL, "package_size" "public"."parcel_details_package_size_enum", "weight" double precision NOT NULL, "length" double precision NOT NULL, "height" double precision NOT NULL, "width" double precision, "parcel_photos" text array DEFAULT ARRAY[]::text[], "cod_amount" double precision, "createdBy" character varying NOT NULL, "updatedBy" character varying NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean, "request_id" integer, CONSTRAINT "PK_b77d29d1dbf73abacccbb48c35f" PRIMARY KEY ("parcel_id"))`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "dropoff_location"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "parcel_photos"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "sender_phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ADD CONSTRAINT "FK_0a2e928659c3496a509f0d26261" FOREIGN KEY ("request_id") REFERENCES "shipment_request"("request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_details" DROP CONSTRAINT "FK_0a2e928659c3496a509f0d26261"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "sender_phone"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "parcel_photos" text array DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "dropoff_location" character varying(255)`);
        await queryRunner.query(`DROP TABLE "parcel_details"`);
        await queryRunner.query(`DROP TYPE "public"."parcel_details_package_size_enum"`);
    }

}
