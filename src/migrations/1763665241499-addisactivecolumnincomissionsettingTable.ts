import { MigrationInterface, QueryRunner } from "typeorm";

export class AddisactivecolumnincomissionsettingTable1763665241499 implements MigrationInterface {
    name = 'AddisactivecolumnincomissionsettingTable1763665241499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_commission_settings" ADD "is_active" boolean NOT NULL DEFAULT true`);
        }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_commission_settings" DROP COLUMN "is_active"`);
    }

}
