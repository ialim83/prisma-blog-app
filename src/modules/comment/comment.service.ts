import { prisma } from "../../lib/prisma";

const createComment = async (payload: { content: string; postId: string; authorId: string, parentId?: string }) =>{
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    });

    if(payload.parentId){
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId
            }
        });
    }

    const result = await prisma.comment.create({
        data: payload
    });
    return result;
    
}  

const getCommentsById = async (commentId: string) => {
    const comments = await prisma.comment.findMany({
        where: {
            commentId: commentId,
            parentId: null
        },
        include: {
            replies: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return comments;
};

export const commentService = {
    createComment,
    getCommentsById,
    
}