import express from 'express';
import { commentController } from './comment.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.post("/",auth(UserRole.USER, UserRole.ADMIN), commentController.createComment);

// get comments by id
router.get("/:commentId",auth(UserRole.USER, UserRole.ADMIN), commentController.getCommentsById);

export const commentRouter = router;