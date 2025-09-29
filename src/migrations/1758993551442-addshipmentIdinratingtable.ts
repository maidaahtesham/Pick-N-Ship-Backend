import { MigrationInterface, QueryRunner } from "typeorm";

export class AddshipmentIdinratingtable1758993551442 implements MigrationInterface {
    name = 'AddshipmentIdinratingtable1758993551442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ratings" ADD "shipment_id" integer`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
         await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_348ed50d655354912a58a2251c8" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_348ed50d655354912a58a2251c8"`);
         await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "shipment_id"`);
    }

}
