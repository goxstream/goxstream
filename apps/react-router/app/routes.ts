import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/public-layout.tsx", [
    index("routes/home.tsx"),
    route("browse", "routes/browse.tsx"),
    route("trending", "routes/trending.tsx"),
    route("schedule", "routes/schedule.tsx"),
    route("anime/:slug", "routes/anime/detail.tsx"),
    route("anime/:slug/:episode", "routes/anime/watch.tsx"),
  ]),
] satisfies RouteConfig;
