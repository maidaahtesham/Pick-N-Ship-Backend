import { MigrationInterface, QueryRunner } from "typeorm";

export class AddcomissionsettingTable1763661447026 implements MigrationInterface {
    name = 'AddcomissionsettingTable1763661447026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."admin_commission_settings_commission_type_enum" AS ENUM('standard', 'sme')`);
        await queryRunner.query(`CREATE TABLE "admin_commission_settings" ("id" SERIAL NOT NULL, "commission_type" "public"."admin_commission_settings_commission_type_enum" NOT NULL DEFAULT 'standard', "commission_rate" character varying NOT NULL, "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b963d54ca4eeb9ae4b3c8d259fb" PRIMARY KEY ("id"))`);
        }

    public async down(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.query(`DROP TABLE "admin_commission_settings"`);
        await queryRunner.query(`DROP TYPE "public"."admin_commission_settings_commission_type_enum"`);
    }

}
