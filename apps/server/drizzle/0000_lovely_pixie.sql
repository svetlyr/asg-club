CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`email` text NOT NULL,
	`telephone` text,
	`product` text NOT NULL,
	`needsDesign` integer DEFAULT false NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`designPrice` real,
	`productionPrice` real,
	`markup` real,
	`finalPrice` real,
	`paypalInvoiceId` text,
	`photoFileIds` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
