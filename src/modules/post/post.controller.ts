import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/client";
import paginationSortingHelper from "../../helper/paginationSortingHelper";
import { error } from "console";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Post creation error",
      });
    }

    const result = await PostService.createPost(req.body, user.id as string);

    res.status(202).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post creation error",
      details: error,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const status = req.query.status as PostStatus | undefined;
    const authorId = req.query.authorId as string | undefined;
    // console.log(search);
    const searchString = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined
      : undefined;

    // console.log(isFeatured);

    // const page = Number(req.query.page ?? 1);
    // const limit = Number(req.query.limit ?? 10);
    // const skip = (page - 1) * limit;

    // const sortBy = req.query.sortBy as string | undefined;
    // const sortOrder = req.query.sortOrder as "asc" | "desc" | undefined;

    const {page, limit, skip, sortBy, sortOrder} = paginationSortingHelper(req.query);
    // console.log({page, limit, skip, sortBy, sortOrder});

    const result = await PostService.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post getting error",
      details: error,
    });
  }
};

const getPostByPostId = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId || Array.isArray(postId)) {
      throw new Error("Post ID is required")
    }
    const post = await PostService.getPostByPostId(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({
      error: "Error fetching post",
      details: error,
    });
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found");
    }

    const myPosts = await PostService.getMyPosts(user.id as string);
    res.status(200).json(myPosts);

  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: "Error fetching my posts",
      details: e,
    });
  }
};

const updatePosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found");
    }
    const { postId } = req.params;

    const updatedPost = await PostService.updatePost(postId as string, req.body, user.id as string);

    res.status(200).json(updatedPost);

  } catch (e) {
    const errorMessage = (e instanceof Error) ? e.message : "Unknown error";
    res.status(400).json({
      error: errorMessage,
      details: e,
    });
  }
};



export const postController = {
  createPost,
  getAllPost,
  getPostByPostId,
  getMyPosts,
  updatePosts,
};    

