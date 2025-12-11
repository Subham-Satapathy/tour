CREATE TABLE "tours" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"description" text,
	"from_city_id" integer NOT NULL,
	"to_city_id" integer NOT NULL,
	"distance_km" integer NOT NULL,
	"duration_days" integer DEFAULT 1 NOT NULL,
	"base_price" integer NOT NULL,
	"price_per_km" integer NOT NULL,
	"highlights" text,
	"image_url" varchar(500),
	"gallery_images" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"total_bookings" integer DEFAULT 0 NOT NULL,
	"average_rating" numeric(3, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tours_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DROP TABLE "admin_users" CASCADE;--> statement-breakpoint
ALTER TABLE "tours" ADD CONSTRAINT "tours_from_city_id_cities_id_fk" FOREIGN KEY ("from_city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tours" ADD CONSTRAINT "tours_to_city_id_cities_id_fk" FOREIGN KEY ("to_city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tours_slug_idx" ON "tours" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tours_is_active_idx" ON "tours" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "tours_is_featured_idx" ON "tours" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "tours_from_city_idx" ON "tours" USING btree ("from_city_id");--> statement-breakpoint
CREATE INDEX "tours_to_city_idx" ON "tours" USING btree ("to_city_id");