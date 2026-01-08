import { MigrationInterface, QueryRunner } from "typeorm";

export class Addcolumnpicklatlnginshipmentanddropofflatlonginparceldetails1765230208927 implements MigrationInterface {
    name = 'Addcolumnpicklatlnginshipmentanddropofflatlonginparceldetails1765230208927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_details" ADD "dropoff_lat" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ADD "dropoff_lng" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "pickup_lat" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "pickup_lng" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "pickup_lng"`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "pickup_lat"`);
        await queryRunner.query(`ALTER TABLE "parcel_details" DROP COLUMN "dropoff_lng"`);
        await queryRunner.query(`ALTER TABLE "parcel_details" DROP COLUMN "dropoff_lat"`);
    }

}
