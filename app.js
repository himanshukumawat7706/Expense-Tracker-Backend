import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";

dotenv.config({ path: "./config/config.env" });
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("combined")); // Use 'combined' for better logging in production
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS configuration
const allowedOrigins = "https://hket.vercel.app"|| "http://localhost:3000"
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Log request details for debugging
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`Request Origin: ${req.headers.origin}`);
    console.log(`Request Method: ${req.method}`);
    next();
  });
}

// Routers
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Dynamic port for deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});