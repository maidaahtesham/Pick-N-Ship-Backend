import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatetableroleandrolePermission1761581787722 implements MigrationInterface {
    name = 'CreatetableroleandrolePermission1761581787722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "permission_name" character varying(100) NOT NULL, "module" character varying(100) NOT NULL, "description" text, "status" boolean NOT NULL DEFAULT true, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_on" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(50), "updated_by" character varying(50), CONSTRAINT "UQ_b990eff1fc3540798960d80e452" UNIQUE ("permission_name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."role_permissions_access_level_enum" AS ENUM('view_only', 'add', 'edit', 'full_control')`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("id" SERIAL NOT NULL, "role_id" integer NOT NULL, "permission_id" integer NOT NULL, "access_level" "public"."role_permissions_access_level_enum" NOT NULL, "status" boolean NOT NULL DEFAULT true, "assigned_on" TIMESTAMP NOT NULL DEFAULT now(), "assigned_by" character varying(50), "updated_by" character varying(50), "updated_on" TIMESTAMP DEFAULT now(), "created_on" TIMESTAMP DEFAULT now(), "created_by" character varying(50), "Status" boolean NOT NULL, CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TYPE "public"."role_permissions_access_level_enum"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
