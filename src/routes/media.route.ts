import { Router } from "express";
import mediaController from "../controllers/media.controller";
import uploadFile from "../helpers/fileUpload";
import { catchAsync } from "../helpers/catchAsync.helper";
const router = Router();
router.post("/", uploadFile.array("file"), catchAsync(mediaController.create));

export default router;
