import { type NextFunction, type Request, type Response } from "express";
import { Message } from "../constant/messages";
import HttpException from "../helpers/HttpException.helper";
import { Role } from "../constant/enums";
export const authorization = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw HttpException.unauthorized(Message.notAuthorized);
    try {
      const userRole = req.user.role;
      if (userRole && roles.includes(userRole as Role)) next();
      else throw HttpException.unauthorized(Message.notAuthorized);
    } catch (err: any) {
      throw HttpException.unauthorized(Message.notAuthorized);
    }
  };
};
