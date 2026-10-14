CREATE TABLE `user_settings` (
	`user_id` text PRIMARY KEY NOT NULL,
	`default_quality` text NOT NULL,
	`default_subtitle` text NOT NULL,
	`auto_play_next` integer NOT NULL,
	`auto_skip_intro` integer NOT NULL,
	`preferred_audio` text NOT NULL,
	`new_episode_alerts` integer NOT NULL,
	`watchlist_updates` integer NOT NULL,
	`marketing_emails` integer NOT NULL,
	`public_watchlist` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `watch_histories` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`anime_id` text NOT NULL,
	`episode_id` text NOT NULL,
	`episode_number` integer,
	`progress_percent` real NOT NULL,
	`duration_seconds` integer NOT NULL,
	`progress_seconds` integer NOT NULL,
	`last_watched_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`episode_id`) REFERENCES `episodes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_history_user_episode` ON `watch_histories` (`user_id`,`episode_id`);--> statement-breakpoint
CREATE INDEX `idx_watch_histories_user_last` ON `watch_histories` (`user_id`,`last_watched_at`);--> statement-breakpoint
CREATE TABLE `watchlists` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`anime_id` text NOT NULL,
	`status` text NOT NULL,
	`is_favorite` integer NOT NULL,
	`current_episode` integer NOT NULL,
	`user_rating` real,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_watchlist_user_anime` ON `watchlists` (`user_id`,`anime_id`);--> statement-breakpoint
CREATE TABLE `comment_likes` (
	`id` text PRIMARY KEY NOT NULL,
	`comment_id` text NOT NULL,
	`user_id` text NOT NULL,
	`is_dislike` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_comment_likes_user` ON `comment_likes` (`comment_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `comment_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`comment_id` text NOT NULL,
	`user_id` text,
	`reason` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`anime_id` text NOT NULL,
	`episode_id` text NOT NULL,
	`user_id` text,
	`guest_name` text,
	`guest_email` text,
	`parent_id` text,
	`content` text NOT NULL,
	`is_spoiler` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`episode_id`) REFERENCES `episodes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_comments_episode` ON `comments` (`episode_id`);