import {
  CommentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPosts = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags,
      },
    });
  }

  if (status) {
    andConditions.push({
      status: status,
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured: isFeatured,
    });
  }
  if (authorId) {
    andConditions.push({
      authorId: authorId,
    });
  }

  const allPost = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    pagination: {
      total,
      page,
      limit,
    },
    data: allPost,
  };
};

const getPostByPostId = async (PostId: string) => {
  // console.log("id");
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: PostId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const post = await tx.post.findUnique({
      where: {
        id: PostId,
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: {
                createdAt: "asc",
              },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                  orderBy: {
                    createdAt: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });
    return post;
  });
};

const getMyPosts = async (authorId: string) => {
  // console.log(" my posts");
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
  });

  const myPosts = await prisma.post.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  const total = await prisma.post.count({
    where: {
      authorId: authorId,
    },
  });
  return {
    total,
    data: myPosts,
  };
};

const updatePost = async (postId: string, data: Partial<Post>, authorId: string) => {
  // console.log(postId, data, authorId);
  
    const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (postData.authorId !== authorId) {
    throw new Error("You are not authorized to update this post");
  }

  const updatedPost = await prisma.post.update({
    where: {
      id: postData.id,
    },
    data
  });
  return updatedPost;


};

export const PostService = {
  createPost,
  getAllPosts,
  getPostByPostId,
  getMyPosts,
  updatePost,
};
