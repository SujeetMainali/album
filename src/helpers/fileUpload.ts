import fs from "fs";
import multer from "multer";
import path from "path";
import { DotenvConfig } from "../config/env.config";
import { MediaType } from "../constant/enums";
import { EnvironmentModes } from "../constant/enums";
import HttpException from "./HttpException.helper";

const storage = multer.diskStorage({
  destination: function (req: any, _file: any, cb: any) {
    let folderPath = "";

    if (!req.body.type)
      return cb(HttpException.badRequest("Please select file type"), "");
    if (!MediaType[req.body.type as keyof typeof MediaType])
      return cb(HttpException.badRequest("Invalid file type"), "");

    if (DotenvConfig.NODE_ENV === EnvironmentModes.DEVELOPMENT)
      folderPath = path.join(process.cwd(), "public", "uploads", "temp");
    else folderPath = path.resolve(process.cwd(), "public", "uploads", "temp");

    !fs.existsSync(folderPath) && fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },

  filename: (_req, file, cb) => {
    const fileName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "." +
      file.mimetype.split("/").pop();
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
});
export default upload;
