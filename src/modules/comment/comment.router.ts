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

export const commentRouter = router;