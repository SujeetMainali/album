import { type Request, type Response } from "express";
import { Message } from "../constant/messages";
import { StatusCodes } from "../constant/statusCodes";
import HttpException from "../helpers/HttpException.helper";
class MediaController {
  async create(req: Request, res: Response) {
    if (req?.files?.length === 0)
      throw HttpException.badRequest("Sorry! No file uploaded.");

    const data = req?.files?.map((file: any) => {
      return {
        name: file?.filename,
        mimeType: file?.mimetype,
        type: req.body?.type,
      };
    });

    res.status(StatusCodes.CREATED).json({
      status: true,
      message: Message.created,
      data,
    });
  }
}

export default new MediaController();
