import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    

    const result = await commentService.createComment();

    res.status(202).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Comment creation error",
      details: error,
    });
  }
};

export const commentController = {
  createComment,
};