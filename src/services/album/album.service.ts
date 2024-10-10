import { AlbumDTO, UpdateAlbumDTO } from "../../dtos/album/album.dto";
import { AppDataSource } from "../../config/database.config";
import { Album } from "../../entities/album/album.entity";
import CategoryService from "./category.service";
import { MediaService } from "../../services/media.service";
class AlbumService {
  constructor(
    private readonly albumRepo = AppDataSource.getRepository(Album),
    private readonly categoryService = new CategoryService(),
    private readonly mediaService = new MediaService()
  ) {}

  async createAlbum(data: AlbumDTO) {
    const category = await this.categoryService.getCategoryById(data.category);
    if (!category) return "Category not found";
    const newAlbum = new Album();
    newAlbum.title = data.title;
    newAlbum.description = data.description;
    newAlbum.photographer = data.photographer;
    newAlbum.year = data.year;
    newAlbum.category = category;
    const album = await this.albumRepo.save(newAlbum);
    if (data?.media && data?.media.length > 0) {
      await Promise.all(
        data?.media?.map(async (mediaItem) => {
          const media = await this.mediaService.uploadFile(mediaItem);
          media.album = album;
          await media.save();
        })
      );
    }
    return album.save();
  }

  async updateAlbum(id: string, data: UpdateAlbumDTO) {
    const album = await this.albumRepo.findOne({
      where: {
        id,
      },
      relations: ["category"],
    });
    if (!album) return "Album not found";
    const category = await this.categoryService.getCategoryById(data.category);
    if (!category) return "Category not found";
    album.title = data.title;
    album.description = data.description;
    album.photographer = data.photographer;
    album.year = data.year;
    album.category = category;
    const updatedAlbum = await album.save();
    await this.handleMediaUpdate(updatedAlbum, data);
    return album.save();
  }

  private async handleMediaUpdate(company: Album, data: UpdateAlbumDTO) {
    if (data.media && data.media.length > 0)
      await Promise.all(
        data.media.map(async (mediaItem) => {
          const media = await this.mediaService.uploadFile(mediaItem);
          media.album = company;
          await media.save();
        })
      );

    if (data.deletedMedia && data.deletedMedia.length > 0) {
      await Promise.all(
        data.deletedMedia.map(async (mediaId) => {
          await this.mediaService.delete(mediaId);
        })
      );
    }
  }
}

export default AlbumService;
