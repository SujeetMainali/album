import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import rateLimit from "express-rate-limit";
import { DotenvConfig } from "../config/env.config";
import path from "path";
// import routes from "../routes/index.route";
import { StatusCodes } from "../constant/statusCodes";
import { errorHandler } from "./errorHandler.middleware";
import { morganMiddleware } from "./morgan.middleware";
import { EnvironmentModes } from "../constant/enums";
const middleware = (app: Application) => {
  const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  });

  app.use(compression());

  app.use(
    cors({
      origin: DotenvConfig.CORS_ORIGIN,
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers["user-agent"];
    const apiKey = req.headers["x-api-key"];
    if (userAgent?.includes("Mozilla")) {
      next();
    } else {
      if (apiKey === DotenvConfig.API_KEY) next();
      else res.status(StatusCodes.FORBIDDEN).send("Forbidden");
    }
  });

  app.use(limit);

  app.use(
    express.json({
      limit: "100mb",
    })
  );
  app.use(morganMiddleware);
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  // app.use("/api", routes);

  if (DotenvConfig.NODE_ENV === EnvironmentModes.PRODUCTION) {
    app.use(
      "/public/uploads",
      express.static(path.join(__dirname, "..", "..", "public/uploads"))
    );

    const viewsPath = path.resolve(
      process.cwd(),
      "../../../../frontend",
      "_work",
      "CRM--frontend",
      "CRM--frontend",
      "dist"
    );
    const staticFolder = path.resolve(process.cwd(), "public/uploads");
    app.use(express.static(staticFolder));
    app.use(express.static(viewsPath));
    app.get("*", (_, res) => {
      res.sendFile(path.resolve(viewsPath, "index.html"));
    });
  } else {
    app.use(express.static(path.resolve(process.cwd(), "public/uploads")));
  }
  app.use("/", (_, res: Response) => {
    res.send("index");
  });

  app.use(errorHandler);
};
export default middleware;
