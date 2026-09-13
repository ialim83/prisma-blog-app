import express, {Application} from "express";
import { postRouter } from "./modules/post/post.router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
const app: Application = express();
app.use(express.json())

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", postRouter)
 
app.get("/", (req,res)=>{
    res.send("Hello world")
})

export default app;

