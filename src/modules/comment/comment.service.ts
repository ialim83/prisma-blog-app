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

export const commentService = {
  createComment,
  getCommentsById,
  getCommentsByAuthorId,
};
