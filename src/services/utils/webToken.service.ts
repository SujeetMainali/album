import jwt from "jsonwebtoken";
import { DotenvConfig } from "../../config/env.config";
import { Role } from "../../constant/enums";
import HttpException from "../../helpers/HttpException.helper";
import {
  type IJwtOptions,
  type IJwtPayload,
} from "../../interface/Jwt.interfaces";
import { Message } from "../../constant/messages";
class WebTokenService {
  sign(user: IJwtPayload, options: IJwtOptions, role: Role): string {
    return jwt.sign(
      {
        id: user.id,
        companyId: user.companyId,
        employeeId: user.employeeId,
        role,
      },
      options.secret,
      {
        expiresIn: options.expiresIn,
      }
    );
  }

  verify(token: string, secret: string): any {
    try {
      const decoded = jwt.verify(token, secret) as any;
      return decoded;
    } catch (error) {
      // eslint-disable-next-line
      if (error == "TokenExpiredError: jwt expired") return "TOKEN_EXPIRED";
      else throw HttpException.unauthorized(Message.notAuthorized);
    }
  }

  generateTokens(
    user: IJwtPayload,
    role?: Role
  ): { accessToken: string; refreshToken: string } {
    const accessToken = this.sign(
      user,
      {
        expiresIn: DotenvConfig.ACCESS_TOKEN_EXPIRES_IN,
        secret: DotenvConfig.ACCESS_TOKEN_SECRET,
      },
      role ?? Role.USER
    );

    const refreshToken = this.sign(
      user,
      {
        expiresIn: DotenvConfig.REFRESH_TOKEN_EXPIRES_IN,
        secret: DotenvConfig.REFRESH_TOKEN_SECRET,
      },
      role ?? Role.USER
    );
    return { accessToken, refreshToken };
  }
}

export default new WebTokenService();
