import { MigrationInterface, QueryRunner } from "typeorm";

export class AddvalueinenuminConveyenceDetails1758661295827 implements MigrationInterface {
    name = 'AddvalueinenuminConveyenceDetails1758661295827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]::text[]`);
         await queryRunner.query(`ALTER TYPE "public"."company_çonveyance_details_conveyance_types_enum" RENAME TO "company_çonveyance_details_conveyance_types_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."company_çonveyance_details_conveyance_types_enum" AS ENUM('bike', 'van', 'truck', 'car')`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_details" ALTER COLUMN "conveyance_types" TYPE "public"."company_çonveyance_details_conveyance_types_enum" USING "conveyance_types"::"text"::"public"."company_çonveyance_details_conveyance_types_enum"`);
        await queryRunner.query(`DROP TYPE "public"."company_çonveyance_details_conveyance_types_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."company_çonveyance_details_conveyance_types_enum_old" AS ENUM('bike', 'van', 'truck')`);
        await queryRunner.query(`ALTER TABLE "company_çonveyance_details" ALTER COLUMN "conveyance_types" TYPE "public"."company_çonveyance_details_conveyance_types_enum_old" USING "conveyance_types"::"text"::"public"."company_çonveyance_details_conveyance_types_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."company_çonveyance_details_conveyance_types_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."company_çonveyance_details_conveyance_types_enum_old" RENAME TO "company_çonveyance_details_conveyance_types_enum"`);
         await queryRunner.query(`ALTER TABLE "shipment_request" ALTER COLUMN "parcel_photos" SET DEFAULT ARRAY[]`);
    }

}
