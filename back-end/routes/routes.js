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

// Healthcheck
router.get("/healthcheck", (req, res) => {
  res.status(200).send("healthcheck ok!");
});

// User Auth & Profile
router.post("/signup", userController.createUser);
router.post("/signin", userController.loginUser);

// Only admin can get all users
router.get("/users", verifyToken, requireAdmin, userController.getAllUsers);
router.delete(
  "/users/:id",
  verifyToken,
  requireAdmin,
  userController.deleteUser
);


// Any user can update their profile (optionally you might want to protect this too)
router.put("/users/:id", verifyToken, userController.updateUser);

// Protected: Get logged-in user's own info
router.get("/me", verifyToken, userController.getMe);

// Example protected route for testing
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected route" });
});

// Problem CRUD (protected)
router.post("/problems", verifyToken, problemController.createProblem);
router.get("/problems", verifyToken, problemController.getProblems);
router.get("/problems/:id", verifyToken, problemController.getProblemById);
router.put("/problems/:id", verifyToken, problemController.updateProblem);
router.delete("/problems/:id", verifyToken, problemController.deleteProblem);

// Submission & Solution routes
router.post("/solutions", solutionController.solution);
router.get(
  "/solutions/:userId/:problemId",
  submissionController.getAllSubmission
);
router.get(
  "/group-submission-count/:userId",
  submissionController.getProblemsSolvedUnique
);
router.get(
  "/getAllUserSumbissions/:userId",
  submissionController.getAllUserSubmission
);
router.get("/submissions", submissionController.getAllSubmissions);

// Stripe: Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  const { priceId, email } = req.body;
  try {
    // 1. Find the user by email
    const user = await User.findOne({ email });

    // 2. Check if the user is premium and subscription_end is in the future
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

    // 3. Otherwise, allow Stripe session creation
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      customer_email: email,
      success_url:
        "https://leetify.vercel.app/thankyou?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://leetify.vercel.app/canceltransaction",
      // Optionally, add metadata: { userId: user?._id.toString() }
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Stripe: Get session details
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
