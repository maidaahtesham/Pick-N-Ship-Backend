import { MigrationInterface, QueryRunner } from "typeorm";

export class Removerideridfromsessiontable1764523522370 implements MigrationInterface {
    name = 'Removerideridfromsessiontable1764523522370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qr_sessions" DROP CONSTRAINT "FK_7116f378d8aa775edf0080a7f00"`);
         await queryRunner.query(`ALTER TABLE "qr_sessions" DROP COLUMN "rider_id"`);
         }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "qr_sessions" ADD CONSTRAINT "FK_7116f378d8aa775edf0080a7f00" FOREIGN KEY ("rider_id") REFERENCES "rider"("rider_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
