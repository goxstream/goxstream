CREATE TABLE "episode_uploads" (
	"episode_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"uploaded_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "server_nodes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "server_nodes" CASCADE;--> statement-breakpoint
ALTER TABLE "stream_sources" DROP CONSTRAINT "stream_sources_server_node_id_server_nodes_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "guest_email" text;--> statement-breakpoint
ALTER TABLE "episode_uploads" ADD CONSTRAINT "episode_uploads_episode_id_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "episode_uploads" ADD CONSTRAINT "episode_uploads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stream_sources" DROP COLUMN "server_node_id";