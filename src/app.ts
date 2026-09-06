import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { authRoutes, } from "./modules/auth/auth.routes";
import errorHandler from "./middlewares/errorHandler.middleware";
import auth from "./middlewares/auth.middleware";
import { organizationRoutes } from "./modules/organization/organization.routes";
import { organizationMemberRoutes } from "./modules/organizationMember/organizationMember.routes";
import roleMiddleware from "./middlewares/role.middleware";
import { projectRouters } from "./modules/project/project.routes";
import { TaskRoutes } from "./modules/task/task.routes";
import { CommentRoutes } from "./modules/comment/comment.routes";
import { TimeLogRoutes } from "./modules/timeLog/timeLog.routes";
import { AttachmentRoutes } from "./modules/attachment/attachment.routes";


const app : Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', (req : Request, res : Response) => {
    res.send('Welcome to TaskFlow API');
})

app.get(
  "/api/rbac-test",
  auth,
  roleMiddleware("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "RBAC test successful",
      data: {
        user: req.user,
        role: "ADMIN",
      },
    });
  },
);



app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/organization-members", organizationMemberRoutes);
app.use("/api/projects", projectRouters);
app.use("/api/tasks", TaskRoutes);
app.use("/api/comments", CommentRoutes);
app.use("/api/time-logs", TimeLogRoutes);
app.use("/api/attachments", AttachmentRoutes);


app.get("/api/protected", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authenticated",
    data: {
      user: req.user,
    },
  });
});


app.use(errorHandler);

export default app;