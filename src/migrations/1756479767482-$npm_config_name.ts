import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1756479767482 implements MigrationInterface {
    name = ' $npmConfigName1756479767482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company_document" ("document_id" SERIAL NOT NULL, "company_id" integer NOT NULL, "trade_license_document_path" character varying(255), "company_document_path" character varying(255), "establishment_card" character varying(255), "trade_license_expiry_date" date, "trade_license_number" character varying(50), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "is_active" boolean NOT NULL, CONSTRAINT "PK_e215a064e0d913771864548c1e5" PRIMARY KEY ("document_id"))`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "company_document" ADD CONSTRAINT "FK_ad825cccc0e8723d0f2438a433a" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_document" DROP CONSTRAINT "FK_ad825cccc0e8723d0f2438a433a"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "company_document"`);
    }

}
