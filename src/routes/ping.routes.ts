import { Router } from "express";

const router = Router();

router.route("/").get((_, res) => {
  res.send({
    status: true,
    message: "pong",
  });
});
export default router;
