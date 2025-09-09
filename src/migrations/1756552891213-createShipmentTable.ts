import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateShipmentTable1756552891213 implements MigrationInterface {
    name = 'CreateShipmentTable1756552891213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shipment" ("id" SERIAL NOT NULL, "courier_company_id" integer NOT NULL, "shipment_id_tag_no" character varying NOT NULL, "request_id" integer, "customer_id" integer NOT NULL, "pickup_time" TIMESTAMP NOT NULL, "delivery_time" TIMESTAMP NOT NULL, "delivery_status" character varying NOT NULL, "cod_amount" double precision NOT NULL, "parcel_type" character varying NOT NULL, "sender_name" character varying NOT NULL, "receiver_name" character varying NOT NULL, "sender_phone" character varying NOT NULL, "receiver_phone" character varying NOT NULL, "shipment_type" character varying NOT NULL, "delivered_on" TIMESTAMP NOT NULL, "job_status" character varying NOT NULL, "parcel_details" text NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "status" boolean, "company_id" integer, "rider_id" integer, "shipping_id" integer, CONSTRAINT "REL_e904040c061f377c18a086fc8f" UNIQUE ("request_id"), CONSTRAINT "PK_f51f635db95c534ca206bf7a0a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD CONSTRAINT "FK_1fa5c21b96471d5c4b6b558d4f1" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_4b23abed9226da7e3253d79671d" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_b5e586803e8beea295ee65e31a4" FOREIGN KEY ("rider_id") REFERENCES "rider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_4685ba9aceffc53197b15b5baf0" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_e904040c061f377c18a086fc8f1" FOREIGN KEY ("request_id") REFERENCES "shipment_request"("request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_5e6d0e0265f57d68c2bacb07c73" FOREIGN KEY ("shipping_id") REFERENCES "shipping_detail"("shipping_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_348ed50d655354912a58a2251c8" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_348ed50d655354912a58a2251c8"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_5e6d0e0265f57d68c2bacb07c73"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_e904040c061f377c18a086fc8f1"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_4685ba9aceffc53197b15b5baf0"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_b5e586803e8beea295ee65e31a4"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_4b23abed9226da7e3253d79671d"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP CONSTRAINT "FK_1fa5c21b96471d5c4b6b558d4f1"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "shipment"`);
    }

}
