import { AppDataSource } from "../../config/database.config";
import { Category } from "../../entities/album/category.entity";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../../dtos/album/category.dto";
class CategoryService {
  constructor(
    private readonly categoryRepo = AppDataSource.getRepository(Category)
  ) {}

  async createCategory(data: CreateCategoryDTO) {
    await this.categoryRepo.create(data).save();
    return "Category created successfully";
  }

  async getCategories() {
    return this.categoryRepo.find();
  }

  async getCategoryById(id: string) {
    return this.categoryRepo.findOne({
      where: { id },
    });
  }

  async updateCategory(data: UpdateCategoryDTO) {
    const category = await this.getCategoryById(data.id);
    if (!category) return "Category not found";
    category.title = data.title;
    return category.save();
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ["albums"],
    });
    if (!category) return "Category not found";
    if (category.albums.length > 0) return "Category has albums, cannot delete";
    return category.remove();
  }
}

export default CategoryService;
