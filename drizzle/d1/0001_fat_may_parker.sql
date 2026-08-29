CREATE TABLE `episode_uploads` (
	`episode_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`uploaded_at` integer NOT NULL,
	FOREIGN KEY (`episode_id`) REFERENCES `episodes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `server_nodes`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_stream_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`episode_id` text NOT NULL,
	`server_name` text,
	`stream_url` text NOT NULL,
	`format` text NOT NULL,
	`quality` text NOT NULL,
	`url_1080p` text,
	`url_720p` text,
	`url_480p` text,
	`url_360p` text,
	`is_primary` integer NOT NULL,
	FOREIGN KEY (`episode_id`) REFERENCES `episodes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_stream_sources`("id", "episode_id", "server_name", "stream_url", "format", "quality", "url_1080p", "url_720p", "url_480p", "url_360p", "is_primary") SELECT "id", "episode_id", "server_name", "stream_url", "format", "quality", "url_1080p", "url_720p", "url_480p", "url_360p", "is_primary" FROM `stream_sources`;--> statement-breakpoint
DROP TABLE `stream_sources`;--> statement-breakpoint
ALTER TABLE `__new_stream_sources` RENAME TO `stream_sources`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `comments` ADD `guest_email` text;