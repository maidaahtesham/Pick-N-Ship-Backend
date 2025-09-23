import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPRofilecompletecolumnincompanyTable1758569480590 implements MigrationInterface {
    name = 'AddIsPRofilecompletecolumnincompanyTable1758569480590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courier_company" ADD "is_profile_complete" boolean`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "courier_company" DROP COLUMN "is_profile_complete"`);
    }

}
