import { MigrationInterface, QueryRunner } from "typeorm";

export class Addroletable1761336791158 implements MigrationInterface {
    name = 'Addroletable1761336791158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "role_name" character varying(100) NOT NULL, "description" text, "status" boolean NOT NULL DEFAULT true, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "updated_on" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(50), "updated_by" character varying(50), CONSTRAINT "UQ_ac35f51a0f17e3e1fe121126039" UNIQUE ("role_name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vendor_user" ADD "role_id" integer`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "vendor_user" ADD CONSTRAINT "FK_9d4d420a77caf70cf5274c979b8" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendor_user" DROP CONSTRAINT "FK_9d4d420a77caf70cf5274c979b8"`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "vendor_user" DROP COLUMN "role_id"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
