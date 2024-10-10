import { Router, type Response } from "express";
import { type IRoute } from "../interface/global.interface";
import pingRoute from "./ping.routes";

const router = Router();
const routes: IRoute[] = [
  {
    route: pingRoute,
    path: "/ping",
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
