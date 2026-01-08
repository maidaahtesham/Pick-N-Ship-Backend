import { MigrationInterface, QueryRunner } from "typeorm";

export class AddcolumniscodsubmittedinshippingpaymentTable1765562530834 implements MigrationInterface {
    name = 'AddcolumniscodsubmittedinshippingpaymentTable1765562530834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping_payment" ADD "is_cod_submitted" boolean`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "shipping_payment" DROP COLUMN "is_cod_submitted"`);
    }

}
