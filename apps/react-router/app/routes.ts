import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/public-layout.tsx", [
    index("routes/home.tsx"),
    route("browse", "routes/browse.tsx"),
    route("trending", "routes/trending.tsx"),
    route("schedule", "routes/schedule.tsx"),
  ]),
] satisfies RouteConfig;
