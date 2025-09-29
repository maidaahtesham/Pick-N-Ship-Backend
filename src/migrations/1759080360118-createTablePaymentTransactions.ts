import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablePaymentTransactions1759080360118 implements MigrationInterface {
    name = 'CreateTablePaymentTransactions1759080360118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_transactions_paymentmethod_enum" AS ENUM('credit_card', 'debit_card')`);
        await queryRunner.query(`CREATE TYPE "public"."payment_transactions_paymentstatus_enum" AS ENUM('pending', 'success', 'failed', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "payment_transactions" ("id" SERIAL NOT NULL, "paymentMethod" "public"."payment_transactions_paymentmethod_enum", "nameOnCard" character varying(255), "cardTokenOrLast4" character varying(50), "amount" double precision NOT NULL, "paymentStatus" "public"."payment_transactions_paymentstatus_enum" NOT NULL DEFAULT 'pending', "transactionId" text, "createdBy" character varying(50), "updatedBy" character varying(50), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean, "shipment_id" integer, CONSTRAINT "PK_d32b3c6b0d2c1d22604cbcc8c49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
         await queryRunner.query(`ALTER TABLE "payment_transactions" ADD CONSTRAINT "FK_86e3b3b890edf36f2696408d467" FOREIGN KEY ("shipment_id") REFERENCES "shipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_transactions" DROP CONSTRAINT "FK_86e3b3b890edf36f2696408d467"`);
         await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "payment_transactions"`);
        await queryRunner.query(`DROP TYPE "public"."payment_transactions_paymentstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_transactions_paymentmethod_enum"`);
    }

}
