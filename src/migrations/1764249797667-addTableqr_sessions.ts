import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableqrSessions1764249797667 implements MigrationInterface {
    name = 'AddTableqrSessions1764249797667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "qr_sessions" ("id" SERIAL NOT NULL, "session_id" character varying(255) NOT NULL, "company_name" character varying(255) NOT NULL, "rider_name" character varying(255), "used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" TIMESTAMP NOT NULL DEFAULT now(), "createdOn" TIMESTAMP DEFAULT now(), "updatedOn" TIMESTAMP DEFAULT now(), "createdBy" character varying(50), "updatedBy" character varying(50), "status" boolean NOT NULL DEFAULT true, "company_id" integer, "rider_id" integer, CONSTRAINT "UQ_34421415f8df06494a304556dba" UNIQUE ("session_id"), CONSTRAINT "PK_2688eade4d67a03899f3d7ab927" PRIMARY KEY ("id"))`);
         await queryRunner.query(`ALTER TABLE "qr_sessions" ADD CONSTRAINT "FK_12e50d71049d613863f69889cdb" FOREIGN KEY ("company_id") REFERENCES "courier_company"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qr_sessions" ADD CONSTRAINT "FK_7116f378d8aa775edf0080a7f00" FOREIGN KEY ("rider_id") REFERENCES "rider"("rider_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qr_sessions" DROP CONSTRAINT "FK_7116f378d8aa775edf0080a7f00"`);
        await queryRunner.query(`ALTER TABLE "qr_sessions" DROP CONSTRAINT "FK_12e50d71049d613863f69889cdb"`);
          await queryRunner.query(`DROP TABLE "qr_sessions"`);
    }

}
