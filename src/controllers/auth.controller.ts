import { type Request, type Response } from "express";
import { Message } from "../constant/messages";
import { StatusCodes } from "../constant/statusCodes";
import AuthService from "../services/auth.service";
import HttpException from "../helpers/HttpException.helper";
import webTokenService from "../services/utils/webToken.service";
import { RegisterUserDTO } from "../dtos/auth.dto";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  async register(req: Request, res: Response) {
    const userData = req.body as RegisterUserDTO;
    const data = await this.authService.register(userData);
    res.status(StatusCodes.CREATED).json({
      status: true,
      message: data,
    });
  }

  async login(req: Request, res: Response) {
    const data = await this.authService.login(req.body);
    const tokens = webTokenService.generateTokens(
      {
        id: data.id,
      },
      data.role
    );
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: "lax",
      // set 5 minutes
      maxAge: 300000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: "lax",
      // set to 30 days
      maxAge: 2592000000,
    });

    res.status(StatusCodes.SUCCESS).json({
      status: true,
      message: "Logged in successfully",
    });
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(StatusCodes.SUCCESS).json({
      status: true,
      message: "Logged out successfully",
    });
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken)
        throw HttpException.unauthorized(Message.notAuthorized);

      const payload = webTokenService.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      );
      if (!payload) throw HttpException.unauthorized(Message.notAuthorized);

      const tokens = webTokenService.generateTokens(
        {
          id: payload.id,
        },
        payload.role
      );

      res.cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: "lax",
        // set 5 minutes
        maxAge: 300000,
      });
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: "lax",
        // set to 30 days
        maxAge: 2592000000,
      });

      res.status(StatusCodes.SUCCESS).json({
        status: true,
        message: "Token refreshed",
      });
    } catch (error: any) {
      throw HttpException.unauthorized(error?.message);
    }
  }

  async myInfo(req: Request, res: Response) {
    const id = req.user?.id as string;
    const data = await this.authService.myInfo(id);

    res.status(StatusCodes.SUCCESS).json({
      status: true,
      data,
      message: Message.fetched,
    });
  }
}
