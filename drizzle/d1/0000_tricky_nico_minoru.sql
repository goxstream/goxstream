CREATE TABLE `user_settings` (
	`user_id` text PRIMARY KEY NOT NULL,
	`default_quality` text NOT NULL,
	`default_subtitle` text NOT NULL,
	`auto_play_next` integer NOT NULL,
	`auto_skip_intro` integer NOT NULL,
	`preferred_audio` text NOT NULL,
	`new_episode_alerts` integer NOT NULL,
	`watchlist_updates` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`display_name` text NOT NULL,
	`role` text NOT NULL,
	`status` text NOT NULL,
	`membership_tier` text NOT NULL,
	`created_at` integer NOT NULL,
	`last_active_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `anime_genres` (
	`anime_id` text NOT NULL,
	`genre_id` text NOT NULL,
	PRIMARY KEY(`anime_id`, `genre_id`),
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `anime_studios` (
	`anime_id` text NOT NULL,
	`studio_id` text NOT NULL,
	PRIMARY KEY(`anime_id`, `studio_id`),
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`studio_id`) REFERENCES `studios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `animes` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title_romaji` text NOT NULL,
	`title_english` text,
	`title_japanese` text,
	`synopsis` text,
	`cover_image` text,
	`banner_image` text,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`season_name` text,
	`season_year` integer,
	`rating` real,
	`is_featured` integer NOT NULL,
	`is_trending` integer NOT NULL,
	`sub_or_dub` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `animes_slug_unique` ON `animes` (`slug`);--> statement-breakpoint
CREATE TABLE `genres` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `genres_name_unique` ON `genres` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `genres_slug_unique` ON `genres` (`slug`);--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`anime_id` text NOT NULL,
	`release_day` text NOT NULL,
	`release_time` text NOT NULL,
	`timezone` text NOT NULL,
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `studios` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `studios_name_unique` ON `studios` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `studios_slug_unique` ON `studios` (`slug`);--> statement-breakpoint
CREATE TABLE `trending_stats` (
	`anime_id` text PRIMARY KEY NOT NULL,
	`views_today` integer NOT NULL,
	`views_this_week` integer NOT NULL,
	`rank` integer NOT NULL,
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `audio_tracks` (
	`id` text PRIMARY KEY NOT NULL,
	`episode_id` text NOT NULL,
	`label` text NOT NULL,
	`language_code` text NOT NULL,
	`audio_url` text NOT NULL,
	`is_default` integer NOT NULL,
	FOREIGN KEY (`episode_id`) REFERENCES `episodes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `episodes` (
	`id` text PRIMARY KEY NOT NULL,
	`anime_id` text NOT NULL,
	`number` integer NOT NULL,
	`title` text NOT NULL,
	`duration_seconds` integer NOT NULL,
	`thumbnail` text,
	`air_date` integer,
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `server_nodes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`quality` text NOT NULL,
	`priority` integer NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stream_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`episode_id` text NOT NULL,
	`server_node_id` text NOT NULL,
	`stream_url` text NOT NULL,
	`format` text NOT NULL,
	`quality` text NOT NULL,
	FOREIGN KEY (`episode_id`) REFERENCES `episodes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`server_node_id`) REFERENCES `server_nodes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `subtitle_tracks` (
	`id` text PRIMARY KEY NOT NULL,
	`episode_id` text NOT NULL,
	`label` text NOT NULL,
	`language_code` text NOT NULL,
	`file_url` text NOT NULL,
	`is_default` integer NOT NULL,
	FOREIGN KEY (`episode_id`) REFERENCES `episodes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `watch_histories` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`anime_id` text NOT NULL,
	`episode_id` text NOT NULL,
	`progress_seconds` integer NOT NULL,
	`last_watched_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`episode_id`) REFERENCES `episodes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `watchlists` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`anime_id` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE cascade
);
