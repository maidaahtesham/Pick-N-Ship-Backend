import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangecolumnsincodpaymentTable1758465487046 implements MigrationInterface {
    name = 'ChangecolumnsincodpaymentTable1758465487046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "delivered_on"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "amount_received"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "pending_amount"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "retrieved_amount"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "sender_name"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "payment_status"`);
        await queryRunner.query(`CREATE TYPE "public"."cod_payment_payment_status_enum" AS ENUM('pending', 'received_by_rider', 'remitted_to_pns', 'paid_to_company')`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "payment_status" "public"."cod_payment_payment_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_4685ba9aceffc53197b15b5baf0"`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "customer_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_4685ba9aceffc53197b15b5baf0" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_4685ba9aceffc53197b15b5baf0"`);
        await queryRunner.query(`ALTER TABLE "shipment" ALTER COLUMN "customer_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment" ADD CONSTRAINT "FK_4685ba9aceffc53197b15b5baf0" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "payment_status"`);
        await queryRunner.query(`DROP TYPE "public"."cod_payment_payment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "payment_status" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "sender_name" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "retrieved_amount" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "pending_amount" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "amount_received" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "delivered_on" character varying(255)`);
    }

}
