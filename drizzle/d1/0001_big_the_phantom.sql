ALTER TABLE `user_settings` ADD `marketing_emails` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `user_settings` ADD `public_watchlist` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `avatar_url` text;--> statement-breakpoint
ALTER TABLE `users` ADD `banner_url` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `animes` ADD `episodes_count` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `animes` ADD `duration_per_ep` text;--> statement-breakpoint
ALTER TABLE `animes` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `schedules` ADD `episode_number` integer;--> statement-breakpoint
ALTER TABLE `schedules` ADD `status` text NOT NULL;--> statement-breakpoint
ALTER TABLE `trending_stats` ADD `previous_rank` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `trending_stats` ADD `weekly_views` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `trending_stats` ADD `monthly_views` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `trending_stats` ADD `total_views` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `trending_stats` ADD `trend_score` real NOT NULL;--> statement-breakpoint
ALTER TABLE `trending_stats` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `audio_tracks` ADD `type` text NOT NULL;--> statement-breakpoint
ALTER TABLE `episodes` ADD `status` text NOT NULL;--> statement-breakpoint
ALTER TABLE `episodes` ADD `views_count` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `episodes` ADD `is_vip` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `episodes` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `server_nodes` ADD `region` text;--> statement-breakpoint
ALTER TABLE `server_nodes` ADD `provider` text;--> statement-breakpoint
ALTER TABLE `server_nodes` ADD `endpoint` text;--> statement-breakpoint
ALTER TABLE `server_nodes` ADD `health_status` text NOT NULL;--> statement-breakpoint
ALTER TABLE `server_nodes` ADD `latency_ms` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `server_nodes` ADD `is_primary` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `stream_sources` ADD `server_name` text;--> statement-breakpoint
ALTER TABLE `stream_sources` ADD `url_1080p` text;--> statement-breakpoint
ALTER TABLE `stream_sources` ADD `url_720p` text;--> statement-breakpoint
ALTER TABLE `stream_sources` ADD `url_480p` text;--> statement-breakpoint
ALTER TABLE `stream_sources` ADD `url_360p` text;--> statement-breakpoint
ALTER TABLE `stream_sources` ADD `is_primary` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `subtitle_tracks` ADD `format` text NOT NULL;--> statement-breakpoint
ALTER TABLE `watch_histories` ADD `episode_number` integer;--> statement-breakpoint
ALTER TABLE `watch_histories` ADD `progress_percent` real NOT NULL;--> statement-breakpoint
ALTER TABLE `watch_histories` ADD `duration_seconds` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `watchlists` ADD `is_favorite` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `watchlists` ADD `current_episode` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `watchlists` ADD `user_rating` real;--> statement-breakpoint
ALTER TABLE `watchlists` ADD `updated_at` integer NOT NULL;