import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  title: string;
}

export class UpdateCategoryDTO extends CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
