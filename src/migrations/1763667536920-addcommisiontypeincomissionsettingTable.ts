import { MigrationInterface, QueryRunner } from "typeorm";

export class AddcommisiontypeincomissionsettingTable1763667536920 implements MigrationInterface {
    name = 'AddcommisiontypeincomissionsettingTable1763667536920'

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TYPE "public"."admin_commission_settings_commission_type_enum" RENAME TO "admin_commission_settings_commission_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."admin_commission_settings_commission_type_enum" AS ENUM('standard', 'sme', 'custom')`);
        await queryRunner.query(`ALTER TABLE "admin_commission_settings" ALTER COLUMN "commission_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_commission_settings" ALTER COLUMN "commission_type" TYPE "public"."admin_commission_settings_commission_type_enum" USING "commission_type"::"text"::"public"."admin_commission_settings_commission_type_enum"`);
        await queryRunner.query(`ALTER TABLE "admin_commission_settings" ALTER COLUMN "commission_type" SET DEFAULT 'standard'`);
        await queryRunner.query(`DROP TYPE "public"."admin_commission_settings_commission_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."admin_commission_settings_commission_type_enum_old" AS ENUM('standard', 'sme')`);
        await queryRunner.query(`ALTER TABLE "admin_commission_settings" ALTER COLUMN "commission_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_commission_settings" ALTER COLUMN "commission_type" TYPE "public"."admin_commission_settings_commission_type_enum_old" USING "commission_type"::"text"::"public"."admin_commission_settings_commission_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "admin_commission_settings" ALTER COLUMN "commission_type" SET DEFAULT 'standard'`);
        await queryRunner.query(`DROP TYPE "public"."admin_commission_settings_commission_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."admin_commission_settings_commission_type_enum_old" RENAME TO "admin_commission_settings_commission_type_enum"`);
      
    }

}
