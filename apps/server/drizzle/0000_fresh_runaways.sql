CREATE TYPE "public"."services" AS ENUM('Graphic Design', 'Stickers/Decals', 'Jacket Pins', 'Wall Posters/Banners', 'T-Shirts', 'Mugs', 'Keychains', 'Metal Badges and Medals', 'Custom Merch');--> statement-breakpoint
CREATE TYPE "public"."sizes" AS ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL');--> statement-breakpoint
CREATE TYPE "public"."units" AS ENUM('cm', 'inch');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"fullname" varchar NOT NULL,
	"telephone" varchar,
	"serviceType" "services" NOT NULL,
	"description" varchar NOT NULL,
	"url" varchar,
	"quantity" smallint,
	"width" real,
	"height" real,
	"size" "sizes",
	"unitType" "units",
	"comments" varchar,
	"designerPrice" real DEFAULT 0,
	"printerPrice" real DEFAULT 0,
	"factoryPrice" real DEFAULT 0,
	"finalPrice" real,
	"counter" smallint DEFAULT 0,
	"text" varchar DEFAULT ''
);
