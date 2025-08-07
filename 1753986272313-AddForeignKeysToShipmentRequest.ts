import { MigrationInterface, QueryRunner } from "typeorm";

export class AddForeignKeysToShipmentRequest1753986272313 implements MigrationInterface {
    name = 'AddForeignKeysToShipmentRequest1753986272313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP CONSTRAINT "FK_0342db47f494267e8169f747343"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP CONSTRAINT "FK_a9ca1709afe67b85d061e4bc625"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "assigned_rider_id"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "rider_id" integer`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "pickup_location"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "pickup_location" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "dropoff_location"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "dropoff_location" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "parcel_type"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_request_parcel_type_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "parcel_type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "package_size"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_request_package_size_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "package_size" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_request_status_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "request_date" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "pickup_time_slot"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "pickup_time_slot" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "payment_status"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_request_payment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "payment_status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "sender_name"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "sender_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "receiver_name"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "receiver_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "receiver_phone"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "receiver_phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "special_instruction"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "special_instruction" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "createdBy" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "updatedBy" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "createdOn" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "updatedOn" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_e904040c061f377c18a086fc8f1"`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "request_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD CONSTRAINT "FK_fc85504f09bf4b3e4db57c2d133" FOREIGN KEY ("rider_id") REFERENCES "rider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_e904040c061f377c18a086fc8f1" FOREIGN KEY ("request_id") REFERENCES "shipment_request"("request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_e904040c061f377c18a086fc8f1"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP CONSTRAINT "FK_fc85504f09bf4b3e4db57c2d133"`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "request_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_e904040c061f377c18a086fc8f1" FOREIGN KEY ("request_id") REFERENCES "shipment_request"("request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "updatedOn" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "createdOn" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "updatedBy" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "createdBy" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "special_instruction"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "special_instruction" text`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "receiver_phone"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "receiver_phone" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "receiver_name"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "receiver_name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "sender_name"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "sender_name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "payment_status"`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_request_payment_status_enum" AS ENUM('paid', 'unpaid')`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "payment_status" "public"."shipment_request_payment_status_enum" NOT NULL DEFAULT 'unpaid'`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "pickup_time_slot"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "pickup_time_slot" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "request_date" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_request_status_enum" AS ENUM('pending', 'accepted', 'declined')`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "status" "public"."shipment_request_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "package_size"`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_request_package_size_enum" AS ENUM('small', 'medium', 'large')`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "package_size" "public"."shipment_request_package_size_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "parcel_type"`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_request_parcel_type_enum" AS ENUM('regular', 'bulk', 'large')`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "parcel_type" "public"."shipment_request_parcel_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "dropoff_location"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "dropoff_location" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "pickup_location"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "pickup_location" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP COLUMN "rider_id"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD "assigned_rider_id" integer`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD CONSTRAINT "FK_a9ca1709afe67b85d061e4bc625" FOREIGN KEY ("request_id") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD CONSTRAINT "FK_0342db47f494267e8169f747343" FOREIGN KEY ("assigned_rider_id") REFERENCES "rider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
