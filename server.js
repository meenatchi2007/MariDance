const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend
app.use(express.static('../frontend'));

// Routers (CASE-SENSITIVE – MATCHES YOUR FOLDER)
const signupRouter = require("./Routers/signupRouter");
const contactRouter = require("./Routers/contactRouter");
const enrollmentRouter = require("./Routers/enrollmentRouter");
const adminRouter = require("./Routers/adminRouter");

// Routes
app.use("/api/auth", signupRouter);
app.use("/api/contact", contactRouter);
app.use("/api/enrollment", enrollmentRouter);
app.use("/api/admin", adminRouter);

// Alias routes to match frontend expectations
const { getAllUsers, addUser, deleteUser, updateUser, getAllClasses, addClass, deleteClass, updateClass } = require("./Controllers/adminController");
const { loginUser } = require("./Controllers/signupController");

// Login route (alias for frontend)
app.post("/api/login", loginUser);

app.get("/api/users", getAllUsers);
app.post("/api/users", addUser);
app.delete("/api/users/:id", deleteUser);
app.put("/api/users/:id", updateUser);

app.get("/api/classes", getAllClasses);
app.post("/api/classes", addClass);
app.delete("/api/classes/:id", deleteClass);
app.put("/api/classes/:id", updateClass);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
    console.log("Database:", process.env.MONGO_URI);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log("Make sure MongoDB is running or check your connection string");
  });

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
