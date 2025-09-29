import { MigrationInterface, QueryRunner } from "typeorm";

export class AddpaymentsttaustoShipmentTable1759092138747 implements MigrationInterface {
    name = 'AddpaymentsttaustoShipmentTable1759092138747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "shipment_id" integer`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD CONSTRAINT "UQ_1fa5c21b96471d5c4b6b558d4f1" UNIQUE ("shipment_id")`);
        await queryRunner.query(`CREATE TYPE "public"."shipment_payment_status_enum" AS ENUM('paid', 'unpaid')`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD "payment_status" "public"."shipment_payment_status_enum" DEFAULT 'unpaid'`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
         await queryRunner.query(`ALTER TABLE "cod_payment" ADD CONSTRAINT "FK_1fa5c21b96471d5c4b6b558d4f1" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP CONSTRAINT "FK_1fa5c21b96471d5c4b6b558d4f1"`);
         await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP COLUMN "payment_status"`);
        await queryRunner.query(`DROP TYPE "public"."shipment_payment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP CONSTRAINT "UQ_1fa5c21b96471d5c4b6b558d4f1"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "shipment_id"`);
    }

}
