import { MigrationInterface, QueryRunner } from "typeorm";

export class Addcommissiontypeinseparatetable1757967539630 implements MigrationInterface {
    name = 'Addcommissiontypeinseparatetable1757967539630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."company_commission_rate_commission_type_enum" AS ENUM('standard', 'sme', 'custom')`);
        await queryRunner.query(`CREATE TABLE "company_commission_rate" ("id" SERIAL NOT NULL, "commission_type" "public"."company_commission_rate_commission_type_enum" NOT NULL DEFAULT 'standard', "commission_rate" character varying, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "status" boolean, "company_id" integer, CONSTRAINT "PK_3feec26a82dd79502f18b721a9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "courier_company" DROP COLUMN "commission_type"`);
        await queryRunner.query(`DROP TYPE "public"."courier_company_commission_type_enum"`);
        await queryRunner.query(`ALTER TABLE "courier_company" DROP COLUMN "commission_rate"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "company_commission_rate" ADD CONSTRAINT "FK_7cd4937e85900651e782befd2aa" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_commission_rate" DROP CONSTRAINT "FK_7cd4937e85900651e782befd2aa"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "courier_company" ADD "commission_rate" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."courier_company_commission_type_enum" AS ENUM('standard', 'sme', 'custom')`);
        await queryRunner.query(`ALTER TABLE "courier_company" ADD "commission_type" "public"."courier_company_commission_type_enum" NOT NULL DEFAULT 'standard'`);
        await queryRunner.query(`DROP TABLE "company_commission_rate"`);
        await queryRunner.query(`DROP TYPE "public"."company_commission_rate_commission_type_enum"`);
    }

}
