import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectToDatabase, disconnectFromDatabase } from "./utils/database";
import helmet from "helmet";
import userRoute from "./modules/user/user.route";
import authRoute from "./modules/auth/auth.route";
import videoRoute from "./modules/videos/video.route";
import deserializeUser from "./middleware/deserializeUser";

const app = express();

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(deserializeUser);

app.get("/", (req, res) => res.send(`process.env.NODE_ENV === ${process.env.NODE_ENV}`));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/videos", videoRoute);

const server = app.listen(process.env.PORT, async () => {
  await connectToDatabase();
  console.log(`Server listening at http://localhost:${process.env.PORT}`);
});

const signals = ["SIGTERM", "SIGINT"];

function gracefulShutdown(signal: string) {
  process.on(signal, async () => {
    console.log("Goodbye, got signal", signal);
    server.close();

    // disconnect from the db
    await disconnectFromDatabase();

    console.log("My work here is done");

    process.exit(0);
  });
}

for (let i = 0; i < signals.length; i++) {
  gracefulShutdown(signals[i]);
}
