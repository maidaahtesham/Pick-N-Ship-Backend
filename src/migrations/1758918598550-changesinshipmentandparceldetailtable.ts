import { MigrationInterface, QueryRunner } from "typeorm";

export class Changesinshipmentandparceldetailtable1758918598550 implements MigrationInterface {
    name = 'Changesinshipmentandparceldetailtable1758918598550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP CONSTRAINT "FK_1fa5c21b96471d5c4b6b558d4f1"`);
        await queryRunner.query(`ALTER TABLE "shipment_jobs" DROP CONSTRAINT "FK_41b45960291193a8caeee7c13be"`);
        await queryRunner.query(`ALTER TABLE "parcel_details" DROP CONSTRAINT "FK_0a2e928659c3496a509f0d26261"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_e904040c061f377c18a086fc8f1"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_5e6d0e0265f57d68c2bacb07c73"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_348ed50d655354912a58a2251c8"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP CONSTRAINT "FK_8f6e8fef281b1cb512f51b504d9"`);
        await queryRunner.query(`ALTER TABLE "earnings" DROP CONSTRAINT "FK_aa9e9779817e7d047110e7a2d80"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP CONSTRAINT "REL_1fa5c21b96471d5c4b6b558d4f"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "shipment_id"`);
        await queryRunner.query(`ALTER TABLE "shipment_jobs" DROP COLUMN "shipment_id"`);
        await queryRunner.query(`ALTER TABLE "parcel_details" DROP COLUMN "request_id"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "delivered_on"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "shipping_id"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "request_id"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "delivery_time"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "sender_name"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "receiver_name"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "sender_phone"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "receiver_phone"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "parcel_size"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "pickup_address"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "delivery_address"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "parcel_details"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "parcel_parameters"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "current_location"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "tracking_status"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "job_status"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "shipment_id"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "customer_id"`);
        await queryRunner.query(`ALTER TABLE "earnings" DROP COLUMN "shipment_id"`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ADD "sender_name" character varying`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ADD "sender_phone" character varying`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ADD "shipment_id" integer`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "pickup_location" character varying(255)`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_shipment_status_enum" AS ENUM('pending', 'accepted', 'declined')`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "shipment_status" "public"."shipment_shipment_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TYPE "public"."parcel_details_package_size_enum" RENAME TO "parcel_details_package_size_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."parcel_details_package_size_enum" AS ENUM('small', 'medium', 'large', 'custom')`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "package_size" TYPE "public"."parcel_details_package_size_enum" USING "package_size"::"text"::"public"."parcel_details_package_size_enum"`);
        await queryRunner.query(`DROP TYPE "public"."parcel_details_package_size_enum_old"`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "parcel_type"`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_parcel_type_enum" AS ENUM('regular', 'bulk')`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "parcel_type" "public"."shipment_parcel_type_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "payment_mode"`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_payment_mode_enum" AS ENUM('prepaid', 'cod')`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "payment_mode" "public"."shipment_payment_mode_enum" NOT NULL DEFAULT 'prepaid'`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "weight" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "length" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "height" DROP NOT NULL`);
         await queryRunner.query(`ALTER TABLE "parcel_details" ADD CONSTRAINT "FK_58d053bb88e51d721bc8adfbb0a" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_details" DROP CONSTRAINT "FK_58d053bb88e51d721bc8adfbb0a"`);
         await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "height" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "length" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "weight" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "payment_mode"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_payment_mode_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "payment_mode" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "parcel_type"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_parcel_type_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "parcel_type" character varying`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`CREATE TYPE "public"."parcel_details_package_size_enum_old" AS ENUM('small', 'medium', 'large')`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "package_size" TYPE "public"."parcel_details_package_size_enum_old" USING "package_size"::"text"::"public"."parcel_details_package_size_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."parcel_details_package_size_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."parcel_details_package_size_enum_old" RENAME TO "parcel_details_package_size_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "shipment_status"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_shipment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "pickup_location"`);
        await queryRunner.query(`ALTER TABLE "parcel_details" DROP COLUMN "shipment_id"`);
        await queryRunner.query(`ALTER TABLE "parcel_details" DROP COLUMN "sender_phone"`);
        await queryRunner.query(`ALTER TABLE "parcel_details" DROP COLUMN "sender_name"`);
        await queryRunner.query(`ALTER TABLE "earnings" ADD "shipment_id" integer`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "customer_id" integer`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD "shipment_id" integer`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "job_status" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "tracking_status" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "current_location" text`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "parcel_parameters" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "parcel_details" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "delivery_address" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "pickup_address" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "parcel_size" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "receiver_phone" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "sender_phone" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "receiver_name" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "sender_name" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "delivery_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "request_id" integer`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "shipping_id" integer`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "delivered_on" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ADD "request_id" integer`);
        await queryRunner.query(`ALTER TABLE "shipment_jobs" ADD "shipment_id" integer`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "shipment_id" integer`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD CONSTRAINT "REL_1fa5c21b96471d5c4b6b558d4f" UNIQUE ("shipment_id")`);
        await queryRunner.query(`ALTER TABLE "earnings" ADD CONSTRAINT "FK_aa9e9779817e7d047110e7a2d80" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD CONSTRAINT "FK_8f6e8fef281b1cb512f51b504d9" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_348ed50d655354912a58a2251c8" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_5e6d0e0265f57d68c2bacb07c73" FOREIGN KEY ("shipping_id") REFERENCES "shipping_detail"("shipping_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_e904040c061f377c18a086fc8f1" FOREIGN KEY ("request_id") REFERENCES "shipment_request"("request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ADD CONSTRAINT "FK_0a2e928659c3496a509f0d26261" FOREIGN KEY ("request_id") REFERENCES "shipment_request"("request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_jobs" ADD CONSTRAINT "FK_41b45960291193a8caeee7c13be" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD CONSTRAINT "FK_1fa5c21b96471d5c4b6b558d4f1" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
