const express = require("express");
const router = express.Router();
const { 
    getAllContacts, 
    getAllUsers, 
    getDashboardStats, 
    addUser, 
    deleteUser, 
    updateUser,
    getAllClasses, 
    addClass, 
    deleteClass, 
    updateClass 
} = require("../Controllers/adminController");

router.get("/contacts", getAllContacts);
router.get("/users", getAllUsers);
router.post("/users", addUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);
router.get("/classes", getAllClasses);
router.post("/classes", addClass);
router.delete("/classes/:id", deleteClass);
router.put("/classes/:id", updateClass);
router.get("/stats", getDashboardStats);

module.exports = router;