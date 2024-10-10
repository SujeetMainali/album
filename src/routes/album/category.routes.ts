import { Router } from "express";
import categoryController from "../../controllers/album/category.controller";
import { catchAsync } from "../../helpers/catchAsync.helper";
import RequestValidator from "../../middlewares/Request.Validator";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../../dtos/album/category.dto";
import { authentication } from "../../middlewares/authentication.middleware";
import { authorization } from "../../middlewares/authorization.middleware";
import { Role } from "../../constant/enums";
const router = Router();
router.use(authentication());
router
  .route("/")
  .get(catchAsync(categoryController.getAll))
  .post(
    authorization([Role.ADMIN]),
    RequestValidator.validate(CreateCategoryDTO),
    categoryController.create
  )
  .patch(
    authorization([Role.ADMIN]),
    RequestValidator.validate(UpdateCategoryDTO),
    categoryController.update
  );
router
  .route("/:id")
  .delete(authorization([Role.ADMIN]), catchAsync(categoryController.delete));
