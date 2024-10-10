import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { MediaType } from "../constant/enums";

export class MediaInput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  mimeType: string;

  @IsNotEmpty()
  @IsEnum(MediaType)
  type: MediaType;
}
