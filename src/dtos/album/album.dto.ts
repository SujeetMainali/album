import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { MediaInput } from "../../dtos/media.dto";
import { Type } from "class-transformer";

export class AlbumDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  photographer: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => MediaInput)
  media: MediaInput[];
}

export class UpdateAlbumDTO extends AlbumDTO {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  deletedMedia: string[];
}
