import { MigrationInterface, QueryRunner } from "typeorm";

export class Addcustominpackagesize1759433694414 implements MigrationInterface {
    name = 'Addcustominpackagesize1759433694414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
         await queryRunner.query(`ALTER TYPE "public"."company_çonveyance_pricing_details_size_enum" RENAME TO "company_çonveyance_pricing_details_size_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."company_çonveyance_pricing_details_size_enum" AS ENUM('small', 'medium', 'large', 'custom')`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_pricing_details" ALTER COLUMN "size" TYPE "public"."company_çonveyance_pricing_details_size_enum" USING "size"::"text"::"public"."company_çonveyance_pricing_details_size_enum"`);
        await queryRunner.query(`DROP TYPE "public"."company_çonveyance_pricing_details_size_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."company_çonveyance_pricing_details_size_enum_old" AS ENUM('small', 'medium', 'large')`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_pricing_details" ALTER COLUMN "size" TYPE "public"."company_çonveyance_pricing_details_size_enum_old" USING "size"::"text"::"public"."company_çonveyance_pricing_details_size_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."company_çonveyance_pricing_details_size_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."company_çonveyance_pricing_details_size_enum_old" RENAME TO "company_çonveyance_pricing_details_size_enum"`);
         await queryRunner.query(`ALTER TABLE "parcel_details" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
    }

}
