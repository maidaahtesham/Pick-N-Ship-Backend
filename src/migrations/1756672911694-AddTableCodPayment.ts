import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableCodPayment1756672911694 implements MigrationInterface {
    name = 'AddTableCodPayment1756672911694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cod_payment" ("id" SERIAL NOT NULL, "cod_amount" integer NOT NULL, "payment_status" character varying(50) NOT NULL, "collectedOn" TIMESTAMP NOT NULL DEFAULT now(), "amount_received" character varying(255) NOT NULL, "pending_amount" character varying(255), "retrieved_amount" character varying(255), "sender_name" character varying(255), "delivered_on" character varying(255), "rider_id" integer, "shipment_id" integer, "courier_company_id" integer, CONSTRAINT "REL_1fa5c21b96471d5c4b6b558d4f" UNIQUE ("shipment_id"), CONSTRAINT "PK_8c235770d1a82d438ff38637d0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD CONSTRAINT "FK_9e75b2184b7eb23055fefe6e5d4" FOREIGN KEY ("rider_id") REFERENCES "rider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD CONSTRAINT "FK_1fa5c21b96471d5c4b6b558d4f1" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD CONSTRAINT "FK_7ec841a161d55ed5360b69bb01b" FOREIGN KEY ("courier_company_id") REFERENCES "courier_company"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP CONSTRAINT "FK_7ec841a161d55ed5360b69bb01b"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP CONSTRAINT "FK_1fa5c21b96471d5c4b6b558d4f1"`);
        await queryRunner.query(`ALTER TABLE "cod_payment" DROP CONSTRAINT "FK_9e75b2184b7eb23055fefe6e5d4"`);
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "cod_payment"`);
    }

}
