import express, { Request, Response, NextFunction } from "express";
import { postController } from "./post.controller";
// import { betterAuth } from "better-auth";
import auth, { UserRole } from "../../middlewares/auth";
const router = express.Router();

// export enum UserRole {
//     USER ="USER",
//     ADMIN = "ADMIN"

// }

// declare global {
//     namespace Express {
//         interface Request{
//             user?:{
//                 id: string;
//                 email: string;
//                 name: string;
//                 role: string;
//                 emailVerified: boolean;
//             }
//         }
//     }
// }

// const auth = (...roles: UserRole[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     // get session
//     const session = await betterAuth.api.getSession({
//       headers: req.headers as any,
//     });

//     if (!session) {
//       return res.status(401).json({
//         success: false,
//         message: "your not authorized",
//       });
//     }
//     if (!session.user.emailVerified) {
//       return res.status(403).json({
//         success: false,
//         message: "Your email is not verified yet, please, verify your email",
//       });
//     }

//     req.user={
//         id: session.user.id,
//         email: session.user.email,
//         name: session.user.name,
//         role: session.user.role as string,
//         emailVerified: session.user.emailVerified
//     }

//     if(!roles.length && roles.includes(req.user.role as UserRole) ){
//         return res.status(403).json({
//         success: false,
//         message: "Forbidden! You don't have access to this resources.",
//       });
//     }

//     // console.log(session);
//     next();
//   };
// };

router.post("/", auth(UserRole.USER), postController.createPost);

export const postRouter = router;
