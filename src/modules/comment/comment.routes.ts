import { Router } from "express";

import auth from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validate.middleware";

import { CommentController } from "./comment.controller";
import { CommentValidation } from "./comment.validation";

const router = Router();

// Create Comment
router.post(
  "/",
  auth,
  validateRequest(CommentValidation.createCommentSchema),
  CommentController.createComment,
);

// Get Comments By Task
router.get(
  "/task/:taskId",
  auth,
  CommentController.getCommentsByTask,
);

// Get Comment By ID
router.get(
  "/:commentId",
  auth,
  CommentController.getCommentById,
);

// Update Comment
router.patch(
  "/:commentId",
  auth,
  validateRequest(CommentValidation.updateCommentSchema),
  CommentController.updateComment,
);

// Delete Comment
router.delete(
  "/:commentId",
  auth,
  CommentController.deleteComment,
);

export const CommentRoutes = router;