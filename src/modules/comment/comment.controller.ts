import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);

    res.status(202).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Comment creation error",
      details: error,
    });
  }
};

const getCommentsById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const comments = await commentService.getCommentsById(commentId as string);
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({
      error: "Failed to fetch comments",
      details: error,
    });
  }
};


 

export const commentController = {
  createComment,
  getCommentsById,
};