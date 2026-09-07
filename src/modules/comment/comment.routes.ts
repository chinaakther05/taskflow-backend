import { Router } from "express";

import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";

import { CommentController } from "./comment.controller";
import { CommentValidation } from "./comment.validation";

const router = Router();


router.post("/",auth,validateRequest(CommentValidation.createCommentSchema),CommentController.createComment,);

// Get Comments By Task
router.get("/task/:taskId",auth,CommentController.getCommentsByTask,);

// Get Comment By ID
router.get("/:commentId",auth,CommentController.getCommentById,);

router.patch("/:commentId",auth,validateRequest(CommentValidation.updateCommentSchema),CommentController.updateComment,);


router.delete("/:commentId",auth,CommentController.deleteComment,);

export const CommentRoutes = router;