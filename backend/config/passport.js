import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateTokenJwt.js";
import { universityEmailDomains } from "../utils/universityDomain.js";
import { universityDomains } from "../utils/universityDomains.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Caută user existent
        console.log("PROFILE", profile);
        let user = await User.findOne({ googleId: profile.id });

        const domain = profile.emails[0].value.split("@")[1];
        const universityName = universityDomains[domain];
        const domainValid = universityEmailDomains.find(
          (Unidomain) => Unidomain == domain,
        );
        if (domainValid === undefined) {
          return done(null, false, { message: "Invalid email domain" });
        }
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            user.googleId = profile.id;
            // Generează token după link cont
            await user.save();
          } else {
            // Creează user nou
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              university: universityName || "Unknown University",
              profilePicture: profile.photos[0].value,
            });
            user.isVerified = true;
            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);
