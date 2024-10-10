import { Router } from "express";
import { catchAsync } from "../../helpers/catchAsync.helper";
import RequestValidator from "../../middlewares/Request.Validator";
import albumController from "../../controllers/album/album.controller";
import { authentication } from "../../middlewares/authentication.middleware";
import { authorization } from "../../middlewares/authorization.middleware";
import { Role } from "../../constant/enums";
import { AlbumDTO, UpdateAlbumDTO } from "../../dtos/album/album.dto";
const router = Router();
router.use(authentication());
router
  .route("/")
  .get(catchAsync(albumController.getAll))
  .post(
    authorization([Role.USER, Role.ADMIN]),
    RequestValidator.validate(AlbumDTO),
    albumController.create
  )
  .patch(
    authorization([Role.ADMIN, Role.USER]),
    RequestValidator.validate(UpdateAlbumDTO),
    albumController.update
  );
router
  .route("/:id")
  .delete(
    authorization([Role.ADMIN, Role.USER]),
    catchAsync(albumController.delete)
  );

export default router;
