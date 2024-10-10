import { AlbumDTO, UpdateAlbumDTO } from "../../dtos/album/album.dto";
import { StatusCodes } from "../../constant/statusCodes";
import { Request, Response } from "express";
import AlbumService from "../../services/album/album.service";
class AlbumController {
  constructor(private readonly albumService = new AlbumService()) {}

  async create(req: Request, res: Response) {
    const data = req.body as AlbumDTO;
    const user = req.user;
    const category = await this.albumService.createAlbum(data, user);
    res.status(StatusCodes.CREATED).json({
      status: true,
      data: category,
      message: "Album created",
    });
  }

  async update(req: Request, res: Response) {
    const data = req.body as UpdateAlbumDTO;
    const category = await this.albumService.updateAlbum(data);
    res.status(StatusCodes.SUCCESS).json({
      status: true,
      data: category,
      message: "Album updated",
    });
  }

  async getAll(req: Request, res: Response) {
    const albums = await this.albumService.getAll();
    res.status(StatusCodes.SUCCESS).json({
      status: true,
      data: albums,
      message: "Albums fetched",
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await this.albumService.deleteAlbum(id);
    res.status(StatusCodes.SUCCESS).json({
      status: true,
      data,
      message: "Album deleted",
    });
  }
}

export default new AlbumController();
