import { MigrationInterface, QueryRunner } from "typeorm";

export class AddacceptancereasoncolumninCourierCompanyTable1758377464999 implements MigrationInterface {
    name = 'AddacceptancereasoncolumninCourierCompanyTable1758377464999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courier_company" ADD "acceptance_reason" text`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "courier_company" DROP COLUMN "acceptance_reason"`);
    }

}
