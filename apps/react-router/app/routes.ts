import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/auth-layout.tsx", [
    route("login", "routes/login.tsx"),
    route("signup", "routes/signup.tsx"),
  ]),
  layout("layouts/public-layout.tsx", [
    index("routes/home.tsx"),
    route("browse", "routes/browse.tsx"),
    route("trending", "routes/trending.tsx"),
    route("schedule", "routes/schedule.tsx"),
    route("anime/:slug", "routes/anime/detail.tsx"),
    route("anime/:slug/:episode", "routes/anime/watch.tsx"),
  ]),
  layout("layouts/user-area-layout.tsx", [
    route("profile", "routes/profile.tsx"),
    route("watchlist", "routes/watchlist.tsx"),
    route("history", "routes/history.tsx"),
    route("settings", "routes/settings.tsx"),
  ]),
] satisfies RouteConfig;

