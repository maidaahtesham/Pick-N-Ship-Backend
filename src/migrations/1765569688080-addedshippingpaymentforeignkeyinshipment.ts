import { MigrationInterface, QueryRunner } from "typeorm";

export class Addedshippingpaymentforeignkeyinshipment1765569688080 implements MigrationInterface {
    name = 'Addedshippingpaymentforeignkeyinshipment1765569688080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cod_payment" ADD "is_paid_to_courier" boolean NOT NULL DEFAULT false`);
           }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "cod_payment" DROP COLUMN "is_paid_to_courier"`);
    }

}
