import type { Router as IRouter } from "express";
import Router from "express";
import { AuthController } from "../controllers/auth.controller";
import { LoginDTO, RegisterUserDTO } from "../dtos/auth.dto";
import RequestValidator from "../middlewares/Request.Validator";
import { authentication } from "../middlewares/authentication.middleware";
import {
  forgetPasswordRateLimiter,
  loginRateLimiter,
} from "../middlewares/rateLimit.middleware";
import { catchAsync } from "../helpers/catchAsync.helper";
const router: IRouter = Router();
const authController = new AuthController();

router.post(
  "/register",
  RequestValidator.validate(RegisterUserDTO),
  catchAsync(authController.register.bind(authController))
);

router.post(
  "/login",
  loginRateLimiter,
  RequestValidator.validate(LoginDTO),
  catchAsync(authController.login.bind(authController))
);
router.post(
  "/refresh-token",
  catchAsync(authController.refreshToken.bind(authController))
);

router.use(authentication());
router.get("/me", catchAsync(authController.myInfo.bind(authController)));
router.post("/logout", catchAsync(authController.logout.bind(authController)));

export default router;
