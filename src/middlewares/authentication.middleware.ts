import { type NextFunction, type Request, type Response } from "express";
import { DotenvConfig } from "../config/env.config";
import { Message } from "../constant/messages";
import HttpException from "../helpers/HttpException.helper";
import webTokenService from "../services/utils/webToken.service";
export const authentication = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;
      if (accessToken) {
        const payload = webTokenService.verify(
          accessToken,
          DotenvConfig.ACCESS_TOKEN_SECRET
        );
        if (payload?.id) {
          req.user = payload;
          next();
        } else if (payload === "TOKEN_EXPIRED") {
          res.status(401).json({
            status: false,
            message: "TOKEN_EXPIRED",
          });
        } else {
          throw HttpException.unauthorized(Message.notAuthorized);
        }
      } else if (refreshToken) {
        res.status(401).json({
          status: false,
          message: "TOKEN_EXPIRED",
        });
      } else {
        throw HttpException.unauthorized(Message.notAuthorized);
      }
    } catch (err: any) {
      next(HttpException.unauthorized(Message.notAuthorized));
    }
  };
};
