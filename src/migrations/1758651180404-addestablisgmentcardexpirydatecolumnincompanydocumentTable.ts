import { MigrationInterface, QueryRunner } from "typeorm";

export class AddestablisgmentcardexpirydatecolumnincompanydocumentTable1758651180404 implements MigrationInterface {
    name = 'AddestablisgmentcardexpirydatecolumnincompanydocumentTable1758651180404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_document" ADD "establishment_card_expiry_date" date`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "company_document" DROP COLUMN "establishment_card_expiry_date"`);
    }

}
