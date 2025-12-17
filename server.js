const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routers (CASE-SENSITIVE – MATCHES YOUR FOLDER)
const signupRouter = require("./Routers/signupRouter");
const contactRouter = require("./Routers/contactRouter");
const enrollmentRouter = require("./Routers/enrollmentRouter");
const adminRouter = require("./Routers/adminRouter");

// Routes
app.use("/api", signupRouter);
app.use("/api", contactRouter);
app.use("/api", enrollmentRouter);
app.use("/api", adminRouter);
app.use("/api/admin", adminRouter);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
