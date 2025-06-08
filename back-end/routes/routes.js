import express from "express";
import Stripe from "stripe";
import * as userController from "../controllers/user.controller.js";
import * as problemController from "../controllers/problem.controller.js";
import * as solutionController from "../controllers/solution.controller.js";
import * as submissionController from "../controllers/submission.controller.js";
import User from "../models/user/user.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * ===========================
 *       API ROUTES DOC
 * ===========================
 *
 * - Healthcheck
 * - User Auth & Profile (Signup, Signin, Profile, Admin-only user listing)
 * - Problem CRUD (protected)
 * - Submissions & Solutions (user code evaluation, results)
 * - Stripe Checkout for subscription
 */

/**
 * Healthcheck endpoint
 * @route GET /healthcheck
 */
router.get("/healthcheck", (req, res) => {
  res.status(200).send("healthcheck ok!");
});

/**
 * User Auth & Profile
 */
router.post("/signup", userController.createUser); // Register new user
router.post("/signin", userController.loginUser); // Login, returns JWT

// Admin-only: List all users, delete any user
router.get("/users", verifyToken, requireAdmin, userController.getAllUsers);
router.delete(
  "/users/:id",
  verifyToken,
  requireAdmin,
  userController.deleteUser
);

// Any logged-in user can update their profile
router.put("/users/:id", verifyToken, userController.updateUser);

// Get currently logged-in user's own profile
router.get("/me", verifyToken, userController.getMe);

/**
 * Protected test route (for auth middleware check)
 * @route GET /protected
 */
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected route" });
});

/**
 * Problem CRUD - All routes are protected (JWT required)
 */
router.post("/problems", verifyToken, problemController.createProblem);
router.get("/problems", verifyToken, problemController.getProblems);
router.get("/problems/:id", verifyToken, problemController.getProblemById);
router.put("/problems/:id", verifyToken, problemController.updateProblem);
router.delete("/problems/:id", verifyToken, problemController.deleteProblem);

/**
 * Submissions & Solutions
 */
// Run user's code and return results (public, not protected)
router.post("/solutions", solutionController.solution);

// Get all submissions by a user for a problem
router.get(
  "/solutions/:userId/:problemId",
  submissionController.getAllSubmission
);

// Get count of unique problems solved by a user
router.get(
  "/group-submission-count/:userId",
  submissionController.getProblemsSolvedUnique
);

// Get all submissions for a user (metadata)
router.get(
  "/getAllUserSumbissions/:userId",
  submissionController.getAllUserSubmission
);

// Get all submissions in the system (admin/statistics)
router.get("/submissions", submissionController.getAllSubmissions);

/**
 * Stripe Subscription Integration
 */

// Create a Stripe checkout session for subscription purchase
router.post("/create-checkout-session", async (req, res) => {
  const { priceId, email } = req.body;
  try {
    // Prevent duplicate active subscriptions
    const user = await User.findOne({ email });

    if (
      user &&
      user.user_status === "PREMIUM_USER" &&
      user.subscription_end &&
      new Date(user.subscription_end) > new Date()
    ) {
      return res.status(400).json({
        error: "You already have an active subscription.",
        subscription_end: user.subscription_end,
      });
    }

    // Create Stripe session for new subscription
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      customer_email: email,
      success_url:
        "https://leetify.vercel.app/thankyou?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://leetify.vercel.app/canceltransaction",
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Retrieve details of a Stripe checkout session
router.get("/checkout-session/:sessionId", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId,
      { expand: ["line_items", "customer"] }
    );
    res.json(session);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;
