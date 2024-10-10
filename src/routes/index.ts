import { Router, type Response } from "express";
import { type IRoute } from "../interface/global.interface";
import pingRoute from "./ping.routes";
import categoryRoutes from "./album/category.routes";
import albumRoutes from "./album/album.routes";
const router = Router();
const routes: IRoute[] = [
  {
    route: pingRoute,
    path: "/ping",
  },
  {
    route: categoryRoutes,
    path: "/category",
  },
  {
    route: albumRoutes,
    path: "/album",
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

router.get("/", (_, res: Response) => {
  res.send({
    status: true,
    message:
      "Welcome to the API. Please refer to the documentation for more information.",
  });
});

export default router;
