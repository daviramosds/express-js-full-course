import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user";
import { comparePassword } from "../utils/helper";

passport.serializeUser(({ id }, done) => {
  done(null, id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id)
    if (!findUser) throw new Error("User Not Found");
    // @ts-ignore ---
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username: string, password: string, done) => {
    try {
      const findUser = await User.findOne({ username }, { password: 0 })
      if (!findUser) return done(null, false, { message: 'User not found' })
      if (!comparePassword(password, findUser.password)) return done(null, false, { message: 'Bad credentials' })
      // @ts-ignore ---
      done(null, findUser);
    } catch (err) {
      done(err, undefined, { message: 'User not found' });
    }
  })
);