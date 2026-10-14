ALTER TABLE `episode_uploads` ADD `storage_key` text;--> statement-breakpoint
ALTER TABLE `episode_uploads` ADD `format` text;--> statement-breakpoint
ALTER TABLE `episode_uploads` ADD `size_bytes` integer;--> statement-breakpoint
ALTER TABLE `episode_uploads` ADD `mime_type` text;--> statement-breakpoint
ALTER TABLE `episode_uploads` ADD `status` text DEFAULT 'ready' NOT NULL;