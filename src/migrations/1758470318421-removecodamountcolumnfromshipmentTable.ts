import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovecodamountcolumnfromshipmentTable1758470318421 implements MigrationInterface {
    name = 'RemovecodamountcolumnfromshipmentTable1758470318421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "cod_amount"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "cod_amount" integer`);
    }

}
