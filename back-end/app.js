import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

// 👇 Restrict CORS to your frontend domain ONLY //
app.use(
  cors({
    origin: "https://leetify.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
routes(app);

app.get("/db-health", (req, res) => {
  const state = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
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
