import { existsSync } from "fs";
import path from "path";
import { AppDataSource } from "../config/database.config";
import { Message } from "../constant/messages";
import Media from "../entities/media.entity";
import HttpException from "../helpers/HttpException.helper";
import { transferImageFromUploadTOTempFolder } from "../helpers/media.helper";
import { getTempFolderPath } from "../helpers/path.helper";

export class MediaService {
  constructor(
    private readonly mediaRepository = AppDataSource.getRepository(Media)
  ) {}
  /**
   * Uploads a media file to the database and moves it from the temporary folder to the upload folder.
   *
   * @param data - The media data including name, mimeType, and type.
   * @returns The uploaded media entity.
   * @throws AppError if the file doesn't exist in the temporary folder.
   */
  async uploadFile(data: any): Promise<Media> {
    if (!existsSync(path.join(getTempFolderPath(), data.name)))
      throw HttpException.badRequest("Sorry!, Media not found");

    const newMedia = this.mediaRepository.create({
      mimeType: data.mimeType,
      name: data.name,
      type: data.type,
    });
    await this.mediaRepository.save(newMedia);
    newMedia.transferImageFromTempTOUploadFolder(newMedia.id, newMedia.type);

    return newMedia;
  }

  /**
   * Deletes a media entity by ID and moves the associated file back to the temporary folder.
   *
   * @param id - The ID of the media entity to be deleted.
   * @returns A success message after deletion.
   * @throws AppError if the media entity is not found.
   */
  async delete(id: string): Promise<string> {
    const media = await this.mediaRepository.findOne({
      where: {
        id,
      },
    });

    if (media !== null) {
      transferImageFromUploadTOTempFolder(media.id, media?.name, media.type);
      await this.mediaRepository.delete({ id });
    }

    return Message.deleted;
  }
}
