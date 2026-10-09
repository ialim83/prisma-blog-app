import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  const result = await prisma.comment.create({
    data: payload,
  });
  return result;
};

const getCommentsById = async (commentId: string) => {
  console.log(commentId);

  const comments = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
        replies:true,
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return comments;
};

const getCommentsByAuthorId = async (authorId: string) => {
  console.log(authorId);

  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
            id: true,
            title: true,
        },
      },
    },
    
  });
  return result;
};

const deleteComment = async (commentId: string, authorId: string) => {
  // console.log("delete comment", commentId, "+", authorId);

  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: authorId,
    },
    select: {
      id: true,
    },
  });
  console.log(commentData);
  if (!commentData) {
    throw new Error("Comment not found or you are not the author");
  }

  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
}

const updateComment = async (commentId: string, data:{content?: string, status?: CommentStatus}, authorId: string ) => {
  // console.log("update", commentId, authorId, data);
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: authorId,
    },
    select: {
      id: true,
    },
  });
  console.log(commentData);
  if (!commentData) {
    throw new Error("Comment not found or you are not the author");
  }

  return await prisma.comment.update({
    where: {
      id: commentData.id,
    },
    data: data,
  });
};

const moderateComment = async (commentId: string, data: { status?: CommentStatus }) => {
  console.log("update", commentId, data);
        const commentData = await prisma.comment.findUniqueOrThrow({
            where: {
              id: commentId,
            },
            select: {
              id: true,
              status: true,
            },
          });

          if(commentData.status ===data.status){
            throw new Error(`your comment already ${data.status} is updated`);
          }


          return await prisma.comment.update({
            where: {
              id: commentId,
            },
            data: data,
          });
};

export const commentService = {
  createComment,
  getCommentsById,
  getCommentsByAuthorId,
  deleteComment,
  updateComment,
  moderateComment,
};
