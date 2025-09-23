import { MigrationInterface, QueryRunner } from "typeorm";

export class SepartecolumnsforestablishmentcarddocumentFrontandback1758635940561 implements MigrationInterface {
    name = 'SepartecolumnsforestablishmentcarddocumentFrontandback1758635940561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_document" DROP COLUMN "establishment_card"`);
        await queryRunner.query(`ALTER TABLE "company_document" ADD "establishment_card_front" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "company_document" ADD "establishment_card_back" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "company_document" DROP COLUMN "establishment_card_back"`);
        await queryRunner.query(`ALTER TABLE "company_document" DROP COLUMN "establishment_card_front"`);
        await queryRunner.query(`ALTER TABLE "company_document" ADD "establishment_card" character varying(255)`);
    }

}
