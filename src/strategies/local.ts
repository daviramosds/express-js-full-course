import passport from "passport";
import { Strategy } from "passport-local";
import { fakeUsers } from "../utils/constants";


passport.serializeUser(({ id }, done) => {
  done(null, id)
})

passport.deserializeUser((id, done) => {
  try {
    const findUser = fakeUsers.find(user => user.id == id)
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy((username: string, password: string, done) => {
    try {
      const findUser = fakeUsers.find((user) => user.username == username);
      if (!findUser) throw new Error("User not found");
      if (findUser.password != password)
        throw new Error("Bad Credentials");
      done(null, findUser);
    } catch (err) {
      done(err, undefined);
    }
  })
);