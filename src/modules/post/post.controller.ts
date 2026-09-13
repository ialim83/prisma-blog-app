import { Request, Response } from "express";
import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await PostService.createPost(req.body);
    res.status(202).json(result);
  } catch (error) {
    res.status(400).json({
        error:"Post creation error",
        details: error
    })
  }
};

export const postController = {
  createPost,
};
