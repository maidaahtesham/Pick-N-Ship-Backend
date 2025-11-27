import { MigrationInterface, QueryRunner } from "typeorm";

export class Addestablishmentcardnumberincompanydocument1762468124256 implements MigrationInterface {
    name = 'Addestablishmentcardnumberincompanydocument1762468124256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_document" ADD "establishment_card_number" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "company_document" DROP COLUMN "establishment_card_number"`);
    }

}
