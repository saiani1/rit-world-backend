import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import hpp from "hpp";
import helmet from "helmet";
import expressSession from "express-session";

import { sequelize } from "./models";
import userRouter from "./routes/user";
import postRouter from "./routes/post";

dotenv.config();
const app = express();
const prod: boolean = process.env.NODE_ENV === "production";

app.listen(3065, () => {
  console.log("서버 실행중");
});

// app.set("port", 5000);
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err: Error) => {
    console.error(err);
  });

if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan("combined"));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}

app.use("/", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      domain: prod ? ".ritworld.com" : undefined,
    },
    name: "rnbck",
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

app.get("/", (req, res, next) => {
  res.send({ message: "ritworld 백엔드 정상동작!" });
});
