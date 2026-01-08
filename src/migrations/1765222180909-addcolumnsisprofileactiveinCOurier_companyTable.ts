import { MigrationInterface, QueryRunner } from "typeorm";

export class AddcolumnsisprofileactiveinCOurierCompanyTable1765222180909 implements MigrationInterface {
    name = 'AddcolumnsisprofileactiveinCOurierCompanyTable1765222180909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courier_company" ADD "is_profile_active" boolean`);     

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "courier_company" DROP COLUMN "is_profile_active"`);
    }

}
