import { Request, Response } from "express";
import { PostService } from "./post.service";


const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if(!user){
      return res.status(400).json({
        error:"Post creation error",
    })
    }
    
    const result = await PostService.createPost(req.body, user.id as string);
    
    res.status(202).json(result);
  } catch (error) {
    res.status(400).json({
        error:"Post creation error",
        details: error
    })
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const {search} = req.query;
    
    // console.log(search);
    const searchString = typeof search === 'string' ? search : undefined

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    
    const result = await PostService.getAllPosts({search:  searchString, tags});
    
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
        error:"Post getting error",
        details: error
    })
  }
};
export const postController = {
  createPost,
  getAllPost
};
