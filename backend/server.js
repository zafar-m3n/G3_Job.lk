import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Use routes
app.use(userRoutes);

app.listen(8081, () => {
  console.log("Running server");
});
