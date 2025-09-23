import { MigrationInterface, QueryRunner } from "typeorm";

export class AddparcelparametersinshipmentTable1758486599846 implements MigrationInterface {
    name = 'AddparcelparametersinshipmentTable1758486599846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment" ADD "parcel_parameters" character varying`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "parcel_parameters"`);
    }

}
