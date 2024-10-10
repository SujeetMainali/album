import { StatusCodes } from "../../constant/statusCodes";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../../dtos/album/category.dto";
import CategoryService from "../../services/album/category.service";
import { Request, Response } from "express";
class CategoryController {
  constructor(private readonly categoryService = new CategoryService()) {}

  async create(req: Request, res: Response) {
    const data = req.body as CreateCategoryDTO;
    const category = await this.categoryService.createCategory(data);
    res.status(StatusCodes.CREATED).json({
      status: true,
      message: category,
    });
  }

  async update(req: Request, res: Response) {
    const data = req.body as UpdateCategoryDTO;
    const category = await this.categoryService.updateCategory(data);
    res.status(StatusCodes.SUCCESS).json({
      status: true,
      message: category,
    });
  }

  async getAll(req: Request, res: Response) {
    const category = await this.categoryService.getCategories();
    res.status(StatusCodes.SUCCESS).json({
      status: true,
      message: category,
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const category = await this.categoryService.deleteCategory(id);
    res.status(StatusCodes.SUCCESS).json({
      status: true,
      message: "Token refreshed",
    });
  }
}

export default new CategoryController();