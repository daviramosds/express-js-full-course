import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user";
import dotenv from 'dotenv'

dotenv.config()

const DISCORD_OAUTH_CLIENT_ID = process.env.DISCORD_OAUTH_CLIENT_ID;
const DISCORD_OAUTH_CLIENT_SECRET = process.env.DISCORD_OAUTH_CLIENT_SECRET;
const DISCORD_OAUTH_REDIRECT_URL = process.env.DISCORD_OAUTH_REDIRECT_URL;

if (!DISCORD_OAUTH_CLIENT_ID || !DISCORD_OAUTH_CLIENT_SECRET || !DISCORD_OAUTH_REDIRECT_URL) {
  throw new Error('Missing environment variable for OAuth2');
}

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const findUser = await DiscordUser.findById(id);
    // @ts-ignore ---
		return findUser ? done(null, findUser) : done(null, null);
	} catch (err) {
		done(err, null);
	}
});

export default passport.use(
	new Strategy(
    {
      clientID: DISCORD_OAUTH_CLIENT_ID,
      clientSecret: DISCORD_OAUTH_CLIENT_SECRET,
      callbackURL: DISCORD_OAUTH_REDIRECT_URL,
      scope: ["identify"],
    },
		async (accessToken, refreshToken, profile, done) => {
			let findUser;
			try {
				findUser = await DiscordUser.findOne({ discordId: profile.id });
			} catch (err) {
				return done(err, undefined);
			}
			try {
				if (!findUser) {
					const newUser = new DiscordUser({
						username: profile.username,
						discordId: profile.id,
					});
					const newSavedUser = await newUser.save();
          // @ts-ignore ---
					return done(null, newSavedUser);
				}
          // @ts-ignore ---
				return done(null, findUser);
			} catch (err) {
				return done(err, undefined);
			}
		}
	)
);