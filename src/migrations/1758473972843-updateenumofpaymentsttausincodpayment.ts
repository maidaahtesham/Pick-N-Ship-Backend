import { MigrationInterface, QueryRunner } from "typeorm";

export class Updateenumofpaymentsttausincodpayment1758473972843 implements MigrationInterface {
    name = 'Updateenumofpaymentsttausincodpayment1758473972843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TYPE "public"."cod_payment_payment_status_enum" RENAME TO "cod_payment_payment_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."cod_payment_payment_status_enum" AS ENUM('pending', 'paid')`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ALTER COLUMN "payment_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ALTER COLUMN "payment_status" TYPE "public"."cod_payment_payment_status_enum" USING "payment_status"::"text"::"public"."cod_payment_payment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ALTER COLUMN "payment_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."cod_payment_payment_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cod_payment_payment_status_enum_old" AS ENUM('pending', 'received_by_rider', 'remitted_to_pns', 'paid_to_company')`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ALTER COLUMN "payment_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ALTER COLUMN "payment_status" TYPE "public"."cod_payment_payment_status_enum_old" USING "payment_status"::"text"::"public"."cod_payment_payment_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ALTER COLUMN "payment_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."cod_payment_payment_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."cod_payment_payment_status_enum_old" RENAME TO "cod_payment_payment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
    }

}
