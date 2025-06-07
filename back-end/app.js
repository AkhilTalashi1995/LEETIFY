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

// CORS middleware
app.use(
  cors({
    origin: "https://leetify.vercel.app",
    credentials: true,
  })
);

// ********** STRIPE WEBHOOK ROUTE (must be FIRST, before express.json) **********
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

    // Handle subscription activation (upgrade to premium)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const subscriptionId = session.subscription;
      const customerEmail = session.customer_email;

      if (subscriptionId && customerEmail) {
        try {
          // THIS IS THE PART TO UPDATE:
          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
          );

          // Try to use subscription.current_period_end if possible
          let subscriptionEnd = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null;

          // Fallback logic if subscriptionEnd is null
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

          // Find and update user
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

// ********** JSON PARSING FOR ALL OTHER ROUTES **********
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ********** ALL OTHER ROUTES **********
routes(app);

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

app.listen(8000, () => {
  console.log("Server started on port 8000!");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.error("MongoDB connection error:", error));

export default app;
