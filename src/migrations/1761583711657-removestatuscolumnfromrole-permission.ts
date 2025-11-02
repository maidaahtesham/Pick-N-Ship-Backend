import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovestatuscolumnfromrolePermission1761583711657 implements MigrationInterface {
    name = 'RemovestatuscolumnfromrolePermission1761583711657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP COLUMN "Status"`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ALTER COLUMN "access_level" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" ALTER COLUMN "access_level" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD "Status" boolean NOT NULL`);
    }

}
