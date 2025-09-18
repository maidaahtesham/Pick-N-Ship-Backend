import { MigrationInterface, QueryRunner } from "typeorm";

export class AddearningandshipmentjobsTable1758198548329 implements MigrationInterface {
    name = 'AddearningandshipmentjobsTable1758198548329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."shipment_jobs_job_status_enum" AS ENUM('assigned', 'picked_up', 'delivered')`);
        await queryRunner.query(`CREATE TABLE "shipment_jobs" ("job_id" SERIAL NOT NULL, "job_status" "public"."shipment_jobs_job_status_enum" NOT NULL DEFAULT 'assigned', "assigned_at" TIMESTAMP, "picked_up_at" TIMESTAMP, "delivered_at" TIMESTAMP, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "status" boolean, "shipment_id" integer, "rider_id" integer, CONSTRAINT "PK_2e20799c55f7e8656d92d885226" PRIMARY KEY ("job_id"))`);
        await queryRunner.query(`CREATE TABLE "earnings" ("earning_id" SERIAL NOT NULL, "service_fee" numeric(10,2) NOT NULL DEFAULT '0', "platform_fee" numeric(10,2) NOT NULL DEFAULT '0', "cod_return_amount" numeric(10,2) NOT NULL DEFAULT '0', "date" date NOT NULL, "shipment_id" integer, "company_id" integer, CONSTRAINT "PK_22371ca6b50a2a55d83dc1bb17b" PRIMARY KEY ("earning_id"))`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "shipment_id_tag_no"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "shipment_type"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "is_paid_to_company" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "is_remitted_to_pns" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "createdOn" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "updatedOn" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "createdBy" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "updatedBy" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "status" boolean`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "tracking_number" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "UQ_907fb0e77189058690ce0f46544" UNIQUE ("tracking_number")`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "parcel_size" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "pickup_address" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "delivery_address" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "payment_mode" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "pickup_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "delivery_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "delivery_status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "cod_amount"`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "cod_amount" integer`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "parcel_type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "parcel_details"`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "parcel_details" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "sender_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "receiver_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "sender_phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "receiver_phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "delivered_on" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "job_status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_jobs" ADD CONSTRAINT "FK_41b45960291193a8caeee7c13be" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_jobs" ADD CONSTRAINT "FK_aaed525283804e7eee239d69994" FOREIGN KEY ("rider_id") REFERENCES "rider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "earnings" ADD CONSTRAINT "FK_aa9e9779817e7d047110e7a2d80" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "earnings" ADD CONSTRAINT "FK_b008c5e01f00abecffde114a03b" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "earnings" DROP CONSTRAINT "FK_b008c5e01f00abecffde114a03b"`);
        await queryRunner.query(`ALTER TABLE "earnings" DROP CONSTRAINT "FK_aa9e9779817e7d047110e7a2d80"`);
        await queryRunner.query(`ALTER TABLE "shipment_jobs" DROP CONSTRAINT "FK_aaed525283804e7eee239d69994"`);
        await queryRunner.query(`ALTER TABLE "shipment_jobs" DROP CONSTRAINT "FK_41b45960291193a8caeee7c13be"`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "job_status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "delivered_on" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "receiver_phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "sender_phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "receiver_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "sender_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "parcel_details"`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "parcel_details" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "parcel_type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "cod_amount"`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "cod_amount" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "delivery_status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "delivery_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "pickup_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "payment_mode"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "delivery_address"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "pickup_address"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "parcel_size"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "UQ_907fb0e77189058690ce0f46544"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "tracking_number"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "updatedOn"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "createdOn"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "is_remitted_to_pns"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "is_paid_to_company"`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "shipment_type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "shipment_id_tag_no" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "earnings"`);
        await queryRunner.query(`DROP TABLE "shipment_jobs"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_jobs_job_status_enum"`);
    }

}
