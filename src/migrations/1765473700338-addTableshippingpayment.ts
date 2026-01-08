import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableshippingpayment1765473700338 implements MigrationInterface {
    name = 'AddTableshippingpayment1765473700338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shipping_payment" ("shipping_payment_id" SERIAL NOT NULL, "standard_delivery_fees" numeric, "platform_fee" numeric, "pns_commission" numeric, "vat" numeric, "total" numeric, "sub_total" numeric, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(100), "updatedBy" character varying(100), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL, "shipment_id" integer, CONSTRAINT "PK_643a518b08fa52f68af76cce97b" PRIMARY KEY ("shipping_payment_id"))`);
        await queryRunner.query(`ALTER TABLE "shipping_payment" ADD CONSTRAINT "FK_c1ca89e57f5feff70d61defb581" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping_payment" DROP CONSTRAINT "FK_c1ca89e57f5feff70d61defb581"`);
         await queryRunner.query(`DROP TABLE "shipping_payment"`);
    }

}
