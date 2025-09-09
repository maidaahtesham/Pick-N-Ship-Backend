import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1756230040779 implements MigrationInterface {
    name = ' $npmConfigName1756230040779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "user_type" character varying NOT NULL, "phone_number" character varying(20), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "status" boolean, "is_email_verified" boolean, "courier_company_id" integer, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_request_parcel_type_enum" AS ENUM('regular', 'bulk', 'contract')`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_request_package_size_enum" AS ENUM('small', 'medium', 'large')`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_request_shipment_status_enum" AS ENUM('pending', 'accepted', 'declined')`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_request_payment_status_enum" AS ENUM('paid', 'unpaid')`);
        await queryRunner.query(`CREATE TABLE "shipment_request" ("request_id" SERIAL NOT NULL, "pickup_location" character varying(255), "dropoff_location" character varying(255), "parcel_type" "public"."shipment_request_parcel_type_enum", "package_size" "public"."shipment_request_package_size_enum", "weight" double precision NOT NULL, "length" double precision NOT NULL, "height" double precision NOT NULL, "width" double precision, "base_price" double precision NOT NULL, "shipment_status" "public"."shipment_request_shipment_status_enum" NOT NULL DEFAULT 'pending', "request_date" TIMESTAMP NOT NULL, "pickup_time_slot" character varying(50), "payment_status" "public"."shipment_request_payment_status_enum" NOT NULL DEFAULT 'unpaid', "sender_name" character varying NOT NULL, "receiver_name" character varying NOT NULL, "receiver_phone" character varying NOT NULL, "special_instruction" text, "parcel_photos" text array DEFAULT ARRAY[]::text[], "createdBy" character varying NOT NULL, "updatedBy" character varying NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean, "customer_id" integer, "rider_id" integer, "company_id" integer, CONSTRAINT "PK_a9ca1709afe67b85d061e4bc625" PRIMARY KEY ("request_id"))`);
        await queryRunner.query(`CREATE TABLE "cod_payment" ("id" SERIAL NOT NULL, "cod_amount" integer NOT NULL, "payment_status" character varying(50) NOT NULL, "collectedOn" TIMESTAMP NOT NULL DEFAULT now(), "amount_received" character varying(255) NOT NULL, "pending_amount" character varying(255), "retrieved_amount" character varying(255), "sender_name" character varying(255), "delivered_on" character varying(255), "rider_id" integer, "shipment_id" integer, "courier_company_id" integer, CONSTRAINT "REL_1fa5c21b96471d5c4b6b558d4f" UNIQUE ("shipment_id"), CONSTRAINT "PK_8c235770d1a82d438ff38637d0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rider" ("id" SERIAL NOT NULL, "rider_name" character varying NOT NULL, "phone_number" character varying NOT NULL, "vehicle_type" character varying NOT NULL, "est_free_time" character varying NOT NULL, "distance" double precision NOT NULL, "availability_status" character varying NOT NULL, "assigned_jobs" integer NOT NULL, "rider_code" character varying NOT NULL, "email" character varying NOT NULL, "licence_number" character varying NOT NULL, "registration_number" character varying NOT NULL, "registration_datetime" TIMESTAMP NOT NULL, "documents" text NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "status" boolean, "company_id" integer, CONSTRAINT "PK_1ed6540e613592e2a470a162ef1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."shipping_detail_conveyance_types_enum" AS ENUM('bike', 'van', 'truck')`);
        await queryRunner.query(`CREATE TYPE "public"."shipping_detail_commission_rate_enum" AS ENUM('standard', '10%', '5%', 'custom')`);
        await queryRunner.query(`CREATE TABLE "shipping_detail" ("shipping_id" SERIAL NOT NULL, "conveyance_types" "public"."shipping_detail_conveyance_types_enum" NOT NULL, "conveyance_details" text NOT NULL, "commission_rate" "public"."shipping_detail_commission_rate_enum" NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "companyCompanyId" integer, CONSTRAINT "PK_6b88b9b0bd94e7739c5257a3e17" PRIMARY KEY ("shipping_id"))`);
        await queryRunner.query(`CREATE TABLE "shipment" ("id" SERIAL NOT NULL, "courier_company_id" integer NOT NULL, "shipment_id_tag_no" character varying NOT NULL, "request_id" integer, "customer_id" integer NOT NULL, "pickup_time" TIMESTAMP NOT NULL, "delivery_time" TIMESTAMP NOT NULL, "delivery_status" character varying NOT NULL, "cod_amount" double precision NOT NULL, "parcel_type" character varying NOT NULL, "sender_name" character varying NOT NULL, "receiver_name" character varying NOT NULL, "sender_phone" character varying NOT NULL, "receiver_phone" character varying NOT NULL, "shipment_type" character varying NOT NULL, "delivered_on" TIMESTAMP NOT NULL, "job_status" character varying NOT NULL, "parcel_details" text NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "status" boolean, "rider_id" integer, "shipping_id" integer, CONSTRAINT "REL_e904040c061f377c18a086fc8f" UNIQUE ("request_id"), CONSTRAINT "PK_f51f635db95c534ca206bf7a0a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ratings" ("id" SERIAL NOT NULL, "stars" integer NOT NULL, "rider_behavior_score" text NOT NULL, "on_time_delivery_score" text NOT NULL, "affordability_score" text NOT NULL, "review" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "status" boolean, "shipmentId" integer, "customerId" integer, "riderId" integer, "companyCompanyId" integer, CONSTRAINT "PK_0f31425b073219379545ad68ed9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_document" ("document_id" SERIAL NOT NULL, "trade_license_document_path" character varying(255), "company_document_path" character varying(255), "establishment_card" character varying(255), "trade_license_expiry_date" date, "trade_license_number" character varying(50), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "is_active" boolean NOT NULL, "companyCompanyId" integer, CONSTRAINT "PK_e215a064e0d913771864548c1e5" PRIMARY KEY ("document_id"))`);
        await queryRunner.query(`CREATE TABLE "vendor_user" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email_address" character varying NOT NULL, "password" character varying NOT NULL, "phone_number" character varying, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "status" boolean, "company_id" integer, CONSTRAINT "PK_139dbded1008da1588c16f34a40" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "courier_company" ("company_id" SERIAL NOT NULL, "company_name" character varying(100) NOT NULL, "username" character varying(50) NOT NULL, "logo" character varying(255), "city" character varying(50) NOT NULL, "company_address" character varying(100), "company_email_address" character varying(20), "company_phone_number" character varying(20), "pns_account_full_name" character varying(20), "registeration_date" character varying(20), "registeration_status" character varying(20), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "status" boolean, "rejection_reason" text, CONSTRAINT "PK_84b854834c2afce2c360eb6582d" PRIMARY KEY ("company_id"))`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_17d4730a5cbe931bc72d83d417d" FOREIGN KEY ("courier_company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD CONSTRAINT "FK_8f6e8fef281b1cb512f51b504d9" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD CONSTRAINT "FK_fc85504f09bf4b3e4db57c2d133" FOREIGN KEY ("rider_id") REFERENCES "rider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ADD CONSTRAINT "FK_1e9b680af7ccaaf0be40a628dd6" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD CONSTRAINT "FK_9e75b2184b7eb23055fefe6e5d4" FOREIGN KEY ("rider_id") REFERENCES "rider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD CONSTRAINT "FK_1fa5c21b96471d5c4b6b558d4f1" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD CONSTRAINT "FK_7ec841a161d55ed5360b69bb01b" FOREIGN KEY ("courier_company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rider" ADD CONSTRAINT "FK_e62f56dcc2d883fa07db486f519" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" ADD CONSTRAINT "FK_8d3f7d1a74a319ac64d31094721" FOREIGN KEY ("companyCompanyId") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_fc0dd075e2b420dc289607f976a" FOREIGN KEY ("courier_company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_b5e586803e8beea295ee65e31a4" FOREIGN KEY ("rider_id") REFERENCES "rider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_4685ba9aceffc53197b15b5baf0" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_e904040c061f377c18a086fc8f1" FOREIGN KEY ("request_id") REFERENCES "shipment_request"("request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_5e6d0e0265f57d68c2bacb07c73" FOREIGN KEY ("shipping_id") REFERENCES "shipping_detail"("shipping_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_4874e03d2c6b5087b928adb9760" FOREIGN KEY ("shipmentId") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_38a6043390012ededac64007e61" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_60acd0593bf5361ba5fd9e403a0" FOREIGN KEY ("riderId") REFERENCES "rider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_10484b129aaa8d014c7b3fa0ec9" FOREIGN KEY ("companyCompanyId") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_document" ADD CONSTRAINT "FK_07099d68723263dec8ca861514a" FOREIGN KEY ("companyCompanyId") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_user" ADD CONSTRAINT "FK_2a2dc1431a1e827521aec92d1ce" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendor_user" DROP CONSTRAINT "FK_2a2dc1431a1e827521aec92d1ce"`);
        await queryRunner.query(`ALTER TABLE "company_document" DROP CONSTRAINT "FK_07099d68723263dec8ca861514a"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_10484b129aaa8d014c7b3fa0ec9"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_60acd0593bf5361ba5fd9e403a0"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_38a6043390012ededac64007e61"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_4874e03d2c6b5087b928adb9760"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_5e6d0e0265f57d68c2bacb07c73"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_e904040c061f377c18a086fc8f1"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_4685ba9aceffc53197b15b5baf0"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_b5e586803e8beea295ee65e31a4"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_fc0dd075e2b420dc289607f976a"`);
        await queryRunner.query(`ALTER TABLE "shipping_detail" DROP CONSTRAINT "FK_8d3f7d1a74a319ac64d31094721"`);
        await queryRunner.query(`ALTER TABLE "rider" DROP CONSTRAINT "FK_e62f56dcc2d883fa07db486f519"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP CONSTRAINT "FK_7ec841a161d55ed5360b69bb01b"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP CONSTRAINT "FK_1fa5c21b96471d5c4b6b558d4f1"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP CONSTRAINT "FK_9e75b2184b7eb23055fefe6e5d4"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP CONSTRAINT "FK_1e9b680af7ccaaf0be40a628dd6"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP CONSTRAINT "FK_fc85504f09bf4b3e4db57c2d133"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" DROP CONSTRAINT "FK_8f6e8fef281b1cb512f51b504d9"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_17d4730a5cbe931bc72d83d417d"`);
        await queryRunner.query(`DROP TABLE "courier_company"`);
        await queryRunner.query(`DROP TABLE "vendor_user"`);
        await queryRunner.query(`DROP TABLE "company_document"`);
        await queryRunner.query(`DROP TABLE "ratings"`);
        await queryRunner.query(`DROP TABLE "shipment"`);
        await queryRunner.query(`DROP TABLE "shipping_detail"`);
        await queryRunner.query(`DROP TYPE "public"."shipping_detail_commission_rate_enum"`);
        await queryRunner.query(`DROP TYPE "public"."shipping_detail_conveyance_types_enum"`);
        await queryRunner.query(`DROP TABLE "rider"`);
        await queryRunner.query(`DROP TABLE "cod_payment"`);
        await queryRunner.query(`DROP TABLE "shipment_request"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_request_payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_request_shipment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_request_package_size_enum"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_request_parcel_type_enum"`);
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}
