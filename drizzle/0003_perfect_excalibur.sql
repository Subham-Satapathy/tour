CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"invoice_number" varchar(100) NOT NULL,
	"pdf_url" text,
	"amount" integer NOT NULL,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_booking_id_unique" UNIQUE("booking_id"),
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "otp_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(200) NOT NULL,
	"code" varchar(6) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "security_deposit" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invoices_booking_id_idx" ON "invoices" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "invoices_invoice_number_idx" ON "invoices" USING btree ("invoice_number");--> statement-breakpoint
CREATE INDEX "otp_verifications_email_idx" ON "otp_verifications" USING btree ("email");--> statement-breakpoint
CREATE INDEX "otp_verifications_expires_at_idx" ON "otp_verifications" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "admin_users_email_idx" ON "admin_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "bookings_vehicle_idx" ON "bookings" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bookings_customer_email_idx" ON "bookings" USING btree ("customer_email");--> statement-breakpoint
CREATE INDEX "bookings_start_date_time_idx" ON "bookings" USING btree ("start_date_time");--> statement-breakpoint
CREATE INDEX "bookings_end_date_time_idx" ON "bookings" USING btree ("end_date_time");--> statement-breakpoint
CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "cities_name_idx" ON "cities" USING btree ("name");--> statement-breakpoint
CREATE INDEX "cities_slug_idx" ON "cities" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_phone_idx" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_is_active_idx" ON "users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "vehicles_type_idx" ON "vehicles" USING btree ("type");--> statement-breakpoint
CREATE INDEX "vehicles_is_active_idx" ON "vehicles" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "vehicles_is_featured_idx" ON "vehicles" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "vehicles_from_city_idx" ON "vehicles" USING btree ("from_city_id");--> statement-breakpoint
CREATE INDEX "vehicles_to_city_idx" ON "vehicles" USING btree ("to_city_id");--> statement-breakpoint
CREATE INDEX "vehicles_fuel_type_idx" ON "vehicles" USING btree ("fuel_type");--> statement-breakpoint
CREATE INDEX "vehicles_transmission_idx" ON "vehicles" USING btree ("transmission_type");--> statement-breakpoint
CREATE INDEX "vehicles_brand_idx" ON "vehicles" USING btree ("brand");--> statement-breakpoint
CREATE INDEX "vehicles_rate_per_day_idx" ON "vehicles" USING btree ("rate_per_day");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_phone_unique" UNIQUE("phone");