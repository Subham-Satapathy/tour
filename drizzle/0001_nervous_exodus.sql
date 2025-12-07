CREATE TYPE "public"."fuel_type" AS ENUM('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'CNG');--> statement-breakpoint
CREATE TYPE "public"."transmission_type" AS ENUM('MANUAL', 'AUTOMATIC');--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "brand" varchar(100);--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "model" varchar(100);--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "year" integer;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "color" varchar(50);--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "license_plate" varchar(50);--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "seating_capacity" integer;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "mileage" varchar(50);--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "fuel_type" "fuel_type";--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "transmission_type" "transmission_type";--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "features" text;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "extra_km_charge" integer;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "included_km_per_day" integer;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "security_deposit" integer;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "gallery_images" text;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "total_bookings" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "average_rating" numeric(3, 2);