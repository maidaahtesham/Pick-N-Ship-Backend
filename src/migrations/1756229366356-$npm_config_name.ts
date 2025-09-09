import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1756229366356 implements MigrationInterface {
    name = ' $npmConfigName1756229366356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "super_admin" ("admin_id" SERIAL NOT NULL, "username" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "contact_phone" character varying(20) NOT NULL, "password" character varying(255) NOT NULL, "city" character varying(50) NOT NULL, "profile_picture_path" character varying(255), CONSTRAINT "PK_641cb721bea8888335e1eb098ae" PRIMARY KEY ("admin_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "super_admin"`);
    }

}
