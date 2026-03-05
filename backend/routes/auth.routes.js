import express from "express";
import passport from "passport";
import {
  signUp,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth,
  sendVerificationEmail,
  businessRegistrations,
  acceptBusinessRegistration,
  rejectBusinessRegistration,
  authWithGoogle,
  loginWeb,
  loginMobile,
  authWithGoogleMobile,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();
router.post("/check-auth", verifyToken, checkAuth);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.post("/google/mobile", authWithGoogle);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  authWithGoogle,
);

router.post("/reject-business-registrations/:id", rejectBusinessRegistration);
router.post("/signup", signUp);
router.post("/verify-email", verifyEmail);
router.post("/resend-verify-email", sendVerificationEmail);
router.post("/login", loginWeb);
router.post("/login/mobile", loginMobile);

router.get("/google/mobile-init", (req, res) => {
  const redirect_uri =
    process.env.BACKEND_URL_1 + "/auth/google/mobile-callback";
  console.log("REDIRECT URI: " + redirect_uri);
  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
    `response_type=code&` +
    `scope=openid%20profile%20email&` +
    `access_type=offline&` +
    `prompt=select_account`;

  console.log("Redirecting to Google OAuth URL:", googleAuthUrl);

  res.redirect(googleAuthUrl);
});

router.get("/google/mobile-callback", authWithGoogleMobile);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.use(verifyToken);
router.get("/business-account-registrations", businessRegistrations);
router.post("/accept-business-registrations/:id", acceptBusinessRegistration);
export default router;
