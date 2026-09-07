import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";
import { AttachmentController } from "./attachment.controller";
import { AttachmentValidation } from "./attachment.validation";

const router = Router();

router.post("/",auth,validateRequest(AttachmentValidation.createAttachmentSchema),AttachmentController.createAttachment,
);

router.get("/task/:taskId",auth, AttachmentController.getAttachmentsByTask,);

router.get("/:attachmentId",auth,AttachmentController.getAttachmentById,);

router.delete("/:attachmentId",auth,AttachmentController.deleteAttachment,);

export const AttachmentRoutes = router;