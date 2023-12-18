import passport from "passport";
import User from "../models/user";
import local from "./local";

export default () => {
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await User.findOne({
        where: { id },
      });
      return done(null, user); // req.user
    } catch (err) {
      console.error(err);
      return done(err);
    }
  });
  local();
};
