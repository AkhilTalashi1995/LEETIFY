import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import * as dotenv from "dotenv";
import Stripe from "stripe";
import User from "./models/user/user.js";

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * ==========================
 *       SERVER DOCS
 * ==========================
 * - Configures Express, CORS, MongoDB, Stripe, and all main middleware
 * - Handles Stripe webhooks for subscription events
 * - Registers API routes and a DB health check endpoint
 * - Starts server on PORT 8000
 */

/**
 * Enable CORS for frontend app
 */
app.use(
  cors({
    origin: "https://leetify.vercel.app",
    credentials: true,
  })
);

/**
 * Stripe Webhook endpoint (MUST use express.raw BEFORE JSON middleware)
 *
 * Handles subscription completed events and upgrades user to PREMIUM.
 * @route POST /stripe-webhook
 */
app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const subscriptionId = session.subscription;
      const customerEmail = session.customer_email;

      if (subscriptionId && customerEmail) {
        try {
          // Retrieve subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
          );

          // Determine subscription end date (from Stripe's UNIX timestamp)
          let subscriptionEnd = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null;

          // Fallback: Calculate subscription end manually if missing
          if (!subscriptionEnd) {
            const startDate = subscription.start_date;
            const interval = subscription.plan.interval;
            const intervalCount = subscription.plan.interval_count || 1;

            let start = new Date(startDate * 1000);
            if (interval === "month") {
              start.setMonth(start.getMonth() + intervalCount);
              subscriptionEnd = start;
            } else if (interval === "year") {
              start.setFullYear(start.getFullYear() + intervalCount);
              subscriptionEnd = start;
            } else {
              subscriptionEnd = start;
            }
          }

          // Upgrade user in DB to PREMIUM_USER and set subscription_end
          const user = await User.findOne({ email: customerEmail });
          if (user) {
            user.user_status = "PREMIUM_USER";
            user.subscription_end = subscriptionEnd;
            await user.save();
            console.log(
              `User ${user.email} upgraded to PREMIUM until ${subscriptionEnd}`
            );
          } else {
            console.log(
              `Stripe webhook: No user found with email ${customerEmail}`
            );
          }
        } catch (err) {
          console.log("Error retrieving subscription or updating user:", err);
        }
      }
    }
    res.json({ received: true });
  }
);

/**
 * JSON body parsing for all other routes
 * (Stripe webhook must be above this)
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Main API routes (controllers, authentication, business logic)
 */
routes(app);

/**
 * MongoDB connection health endpoint
 * @route GET /db-health
 */
app.get("/db-health", (req, res) => {
  const state = mongoose.connection.readyState;
  let status = "";
  switch (state) {
    case 0:
      status = "disconnected";
      break;
    case 1:
      status = "connected";
      break;
    case 2:
      status = "connecting";
      break;
    case 3:
      status = "disconnecting";
      break;
    default:
      status = "unknown";
  }
  res.json({ dbState: status });
});

/**
 * Start the server
 */
app.listen(8000, () => {
  console.log("Server started on port 8000!");
});

/**
 * Connect to MongoDB Atlas
 */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.error("MongoDB connection error:", error));

export default app;
