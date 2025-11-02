import { MigrationInterface, QueryRunner } from "typeorm";

export class AddcolumnsincustomerTable1760563605597 implements MigrationInterface {
    name = 'AddcolumnsincustomerTable1760563605597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "date_of_birth" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "gender" character varying`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "city" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "country" character varying(100)`);
      }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "date_of_birth"`);
    }

}
