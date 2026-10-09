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


const getCommentsByAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const comments = await commentService.getCommentsByAuthorId(authorId as string);
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({
      error: "Failed to fetch comments",
      details: error,
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user
    const { commentId } = req.params;
    await commentService.deleteComment(commentId as string, user?.id as string);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(400).json({
      error: "Failed to delete comment",
      details: error,
    });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user
    const { commentId } = req.params;
    await commentService.updateComment(commentId as string, req.body, user?.id as string);
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    res.status(400).json({
      error: "Failed to update comment",
      details: error,
    });
  }
};
const moderateComment = async (req: Request, res: Response) => {
  try {
    // const user = req.user
    const { commentId } = req.params;
   const result= await commentService.moderateComment(commentId as string, req.body);
    res.status(200).json({ message: "Comment moderated successfully", result });
  } catch (error) {
    res.status(400).json({
      error: "Failed to moderate comment",
      details: error,
    });
  }
};


 

export const commentController = {
  createComment,
  getCommentsById,
  getCommentsByAuthorId,
  deleteComment,
  updateComment,
  moderateComment,
};