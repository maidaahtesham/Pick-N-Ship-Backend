import { MigrationInterface, QueryRunner } from "typeorm";

export class AddcolumnAreainCutsomerTable1759421289884 implements MigrationInterface {
    name = 'AddcolumnAreainCutsomerTable1759421289884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_addresses" ADD "area" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" DROP COLUMN "area"`);
    }

}
