import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";

import { isLoggedIn, isNotLoggedIn } from "./middleware";
import User from "../models/user";
import Post from "../models/post";

const router = express.Router();

router.get("/checkId", async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const findUserId = await User.findOne({
      where: {
        userId: userId,
      },
    });
    if (findUserId) {
      return res.status(200).send({
        isDuplicate: true,
      });
    } else return res.status(200).send({ isDuplicate: false });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/checkNickname", async (req, res, next) => {
  try {
    const nickname = req.query.nickname;
    const findNickname = await User.findOne({
      where: {
        nickname: nickname,
      },
    });
    if (findNickname) {
      return res.status(200).send({
        isDuplicate: true,
      });
    } else return res.status(200).send({ isDuplicate: false });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/signUp", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      userId: req.body.userId,
      password: hashedPassword,
      nickname: req.body.nickname,
    });
    return res.status(200).send("회원가입이 완료되었습니다.");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/signIn", isNotLoggedIn, (req, res, next) => {
  passport.authenticate(
    "local",
    (err: Error, user: User, info: { message: string }) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      if (info) {
        return res.status(401).send(info.message);
      }
      return req.login(user, async (loginErr: Error) => {
        try {
          if (loginErr) {
            return next(loginErr);
          }
          const fullUser = await User.findOne({
            where: { id: user.id },
            include: [
              {
                model: Post,
                as: "Posts",
                attributes: ["id"],
              },
            ],
            attributes: {
              exclude: ["password"],
            },
          });
          return res.json(fullUser);
        } catch (e) {
          console.error(e);
          return next(e);
        }
      });
    }
  )(req, res, next);
});

// router.post("/logout", isLoggedIn, (req, res) => {
//   req.logout();
//   req.session.destroy(() => {
//     res.send("logout 성공");
//   });
// });

interface IUser extends User {
  PostCount: number;
}

router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.id, 10) },
      include: [
        {
          model: Post,
          as: "Posts",
          attributes: ["id"],
        },
      ],
      attributes: ["id", "nickname"],
    });
    if (!user) {
      return res.status(404).send("no user");
    }
    const jsonUser = user.toJSON() as IUser;
    jsonUser.PostCount = jsonUser.Posts ? jsonUser.Posts.length : 0;
    return res.json(jsonUser);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;
