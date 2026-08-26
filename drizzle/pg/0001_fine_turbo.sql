ALTER TABLE "user_settings" ADD COLUMN "marketing_emails" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "public_watchlist" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banner_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "animes" ADD COLUMN "episodes_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "animes" ADD COLUMN "duration_per_ep" text;--> statement-breakpoint
ALTER TABLE "animes" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "episode_number" integer;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "trending_stats" ADD COLUMN "previous_rank" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "trending_stats" ADD COLUMN "weekly_views" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "trending_stats" ADD COLUMN "monthly_views" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "trending_stats" ADD COLUMN "total_views" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "trending_stats" ADD COLUMN "trend_score" real NOT NULL;--> statement-breakpoint
ALTER TABLE "trending_stats" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "audio_tracks" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "views_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "is_vip" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "episodes" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "server_nodes" ADD COLUMN "region" text;--> statement-breakpoint
ALTER TABLE "server_nodes" ADD COLUMN "provider" text;--> statement-breakpoint
ALTER TABLE "server_nodes" ADD COLUMN "endpoint" text;--> statement-breakpoint
ALTER TABLE "server_nodes" ADD COLUMN "health_status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "server_nodes" ADD COLUMN "latency_ms" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "server_nodes" ADD COLUMN "is_primary" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "stream_sources" ADD COLUMN "server_name" text;--> statement-breakpoint
ALTER TABLE "stream_sources" ADD COLUMN "url_1080p" text;--> statement-breakpoint
ALTER TABLE "stream_sources" ADD COLUMN "url_720p" text;--> statement-breakpoint
ALTER TABLE "stream_sources" ADD COLUMN "url_480p" text;--> statement-breakpoint
ALTER TABLE "stream_sources" ADD COLUMN "url_360p" text;--> statement-breakpoint
ALTER TABLE "stream_sources" ADD COLUMN "is_primary" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "subtitle_tracks" ADD COLUMN "format" text NOT NULL;--> statement-breakpoint
ALTER TABLE "watch_histories" ADD COLUMN "episode_number" integer;--> statement-breakpoint
ALTER TABLE "watch_histories" ADD COLUMN "progress_percent" real NOT NULL;--> statement-breakpoint
ALTER TABLE "watch_histories" ADD COLUMN "duration_seconds" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "watchlists" ADD COLUMN "is_favorite" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "watchlists" ADD COLUMN "current_episode" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "watchlists" ADD COLUMN "user_rating" real;--> statement-breakpoint
ALTER TABLE "watchlists" ADD COLUMN "updated_at" timestamp NOT NULL;