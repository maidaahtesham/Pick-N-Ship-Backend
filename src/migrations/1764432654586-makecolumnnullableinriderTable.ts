import { MigrationInterface, QueryRunner } from "typeorm";

export class MakecolumnnullableinriderTable1764432654586 implements MigrationInterface {
    name = 'MakecolumnnullableinriderTable1764432654586'

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "rider" ALTER COLUMN "est_free_time" DROP NOT NULL`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "rider" ALTER COLUMN "est_free_time" SET NOT NULL`);
       }

}
