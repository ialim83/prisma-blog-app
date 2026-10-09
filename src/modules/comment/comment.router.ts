import express from 'express';
import { commentController } from './comment.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();


// get comments by id
router.get("/:commentId",auth(UserRole.USER, UserRole.ADMIN), commentController.getCommentsById);

// get comments by author id
router.get("/author/:authorId",auth(UserRole.USER, UserRole.ADMIN), commentController.getCommentsByAuthorId);



// create comment
router.post("/",auth(UserRole.USER, UserRole.ADMIN), commentController.createComment);

// delete comment
router.delete("/:commentId",auth(UserRole.USER, UserRole.ADMIN), commentController.deleteComment);

// update comment
router.patch("/:commentId",auth(UserRole.USER, UserRole.ADMIN), commentController.updateComment);

// moderate comment
router.patch("/moderate/:commentId",auth(UserRole.ADMIN), commentController.moderateComment);

export const commentRouter = router;