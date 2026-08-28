CREATE TABLE "sessions" (
	"token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"user_agent" text,
	"ip_address" text
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"default_quality" text NOT NULL,
	"default_subtitle" text NOT NULL,
	"auto_play_next" boolean NOT NULL,
	"auto_skip_intro" boolean NOT NULL,
	"preferred_audio" text NOT NULL,
	"new_episode_alerts" boolean NOT NULL,
	"watchlist_updates" boolean NOT NULL,
	"marketing_emails" boolean NOT NULL,
	"public_watchlist" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"banner_url" text,
	"bio" text,
	"role" text NOT NULL,
	"status" text NOT NULL,
	"membership_tier" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"last_active_at" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "anime_genres" (
	"anime_id" text NOT NULL,
	"genre_id" text NOT NULL,
	CONSTRAINT "anime_genres_anime_id_genre_id_pk" PRIMARY KEY("anime_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "anime_studios" (
	"anime_id" text NOT NULL,
	"studio_id" text NOT NULL,
	CONSTRAINT "anime_studios_anime_id_studio_id_pk" PRIMARY KEY("anime_id","studio_id")
);
--> statement-breakpoint
CREATE TABLE "animes" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title_romaji" text NOT NULL,
	"title_english" text,
	"title_japanese" text,
	"synopsis" text,
	"cover_image" text,
	"banner_image" text,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"season_name" text,
	"season_year" integer,
	"episodes_count" integer NOT NULL,
	"duration_per_ep" text,
	"rating" real,
	"is_featured" boolean NOT NULL,
	"is_trending" boolean NOT NULL,
	"sub_or_dub" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "animes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	CONSTRAINT "genres_name_unique" UNIQUE("name"),
	CONSTRAINT "genres_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" text PRIMARY KEY NOT NULL,
	"anime_id" text NOT NULL,
	"release_day" text NOT NULL,
	"release_time" text NOT NULL,
	"episode_number" integer,
	"status" text NOT NULL,
	"timezone" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studios" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	CONSTRAINT "studios_name_unique" UNIQUE("name"),
	CONSTRAINT "studios_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "trending_stats" (
	"anime_id" text PRIMARY KEY NOT NULL,
	"rank" integer NOT NULL,
	"previous_rank" integer NOT NULL,
	"views_today" integer NOT NULL,
	"views_this_week" integer NOT NULL,
	"weekly_views" integer NOT NULL,
	"monthly_views" integer NOT NULL,
	"total_views" integer NOT NULL,
	"trend_score" real NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audio_tracks" (
	"id" text PRIMARY KEY NOT NULL,
	"episode_id" text NOT NULL,
	"label" text NOT NULL,
	"language_code" text NOT NULL,
	"audio_url" text NOT NULL,
	"type" text NOT NULL,
	"is_default" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "episodes" (
	"id" text PRIMARY KEY NOT NULL,
	"anime_id" text NOT NULL,
	"number" integer NOT NULL,
	"title" text NOT NULL,
	"duration_seconds" integer NOT NULL,
	"thumbnail" text,
	"air_date" timestamp,
	"status" text NOT NULL,
	"views_count" integer NOT NULL,
	"is_vip" boolean NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "server_nodes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"region" text,
	"provider" text,
	"endpoint" text,
	"quality" text NOT NULL,
	"priority" integer NOT NULL,
	"status" text NOT NULL,
	"health_status" text NOT NULL,
	"latency_ms" integer NOT NULL,
	"is_primary" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stream_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"episode_id" text NOT NULL,
	"server_node_id" text NOT NULL,
	"server_name" text,
	"stream_url" text NOT NULL,
	"format" text NOT NULL,
	"quality" text NOT NULL,
	"url_1080p" text,
	"url_720p" text,
	"url_480p" text,
	"url_360p" text,
	"is_primary" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subtitle_tracks" (
	"id" text PRIMARY KEY NOT NULL,
	"episode_id" text NOT NULL,
	"label" text NOT NULL,
	"language_code" text NOT NULL,
	"file_url" text NOT NULL,
	"format" text NOT NULL,
	"is_default" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watch_histories" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"anime_id" text NOT NULL,
	"episode_id" text NOT NULL,
	"episode_number" integer,
	"progress_percent" real NOT NULL,
	"duration_seconds" integer NOT NULL,
	"progress_seconds" integer NOT NULL,
	"last_watched_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watchlists" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"anime_id" text NOT NULL,
	"status" text NOT NULL,
	"is_favorite" boolean NOT NULL,
	"current_episode" integer NOT NULL,
	"user_rating" real,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comment_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"comment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"is_dislike" boolean NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comment_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"comment_id" text NOT NULL,
	"user_id" text,
	"reason" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"anime_id" text NOT NULL,
	"episode_id" text NOT NULL,
	"user_id" text,
	"guest_name" text,
	"parent_id" text,
	"content" text NOT NULL,
	"is_spoiler" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_anime_id_animes_id_fk" FOREIGN KEY ("anime_id") REFERENCES "public"."animes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anime_studios" ADD CONSTRAINT "anime_studios_anime_id_animes_id_fk" FOREIGN KEY ("anime_id") REFERENCES "public"."animes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anime_studios" ADD CONSTRAINT "anime_studios_studio_id_studios_id_fk" FOREIGN KEY ("studio_id") REFERENCES "public"."studios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_anime_id_animes_id_fk" FOREIGN KEY ("anime_id") REFERENCES "public"."animes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trending_stats" ADD CONSTRAINT "trending_stats_anime_id_animes_id_fk" FOREIGN KEY ("anime_id") REFERENCES "public"."animes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audio_tracks" ADD CONSTRAINT "audio_tracks_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_anime_id_animes_id_fk" FOREIGN KEY ("anime_id") REFERENCES "public"."animes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_sources" ADD CONSTRAINT "stream_sources_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_sources" ADD CONSTRAINT "stream_sources_server_node_id_server_nodes_id_fk" FOREIGN KEY ("server_node_id") REFERENCES "public"."server_nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subtitle_tracks" ADD CONSTRAINT "subtitle_tracks_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_histories" ADD CONSTRAINT "watch_histories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_histories" ADD CONSTRAINT "watch_histories_anime_id_animes_id_fk" FOREIGN KEY ("anime_id") REFERENCES "public"."animes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_histories" ADD CONSTRAINT "watch_histories_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlists" ADD CONSTRAINT "watchlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlists" ADD CONSTRAINT "watchlists_anime_id_animes_id_fk" FOREIGN KEY ("anime_id") REFERENCES "public"."animes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_reports" ADD CONSTRAINT "comment_reports_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_reports" ADD CONSTRAINT "comment_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_anime_id_animes_id_fk" FOREIGN KEY ("anime_id") REFERENCES "public"."animes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;