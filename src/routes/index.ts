import { Router, type Response } from "express";
import { type IRoute } from "../interface/global.interface";

const router = Router();
const routes: IRoute[] = [];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

router.get("/", (_, res: Response) => {
  res.send({
    status: true,
    message:
      "Welcome to National Production Campaign (crm-Nepal by Returnee Center of Nepal)",
  });
});

export default router;
