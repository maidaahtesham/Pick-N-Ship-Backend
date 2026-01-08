import { MigrationInterface, QueryRunner } from "typeorm";

export class MakedistancecolumnnullableinriderTable1764433553437 implements MigrationInterface {
    name = 'MakedistancecolumnnullableinriderTable1764433553437'

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "rider" ALTER COLUMN "distance" DROP NOT NULL`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`ALTER TABLE "rider" ALTER COLUMN "distance" SET NOT NULL`);
             }

}
