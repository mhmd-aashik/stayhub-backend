CREATE TYPE "public"."property_status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"host_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"city" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"address" text,
	"price_per_night" numeric(12, 2) NOT NULL,
	"max_guests" integer NOT NULL,
	"bedrooms" integer DEFAULT 1 NOT NULL,
	"bathrooms" integer DEFAULT 1 NOT NULL,
	"status" "property_status" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "properties_host_id_idx" ON "properties" USING btree ("host_id");--> statement-breakpoint
CREATE INDEX "properties_city_idx" ON "properties" USING btree ("city");--> statement-breakpoint
CREATE INDEX "properties_status_idx" ON "properties" USING btree ("status");