const express = require("express");
const router = express.Router();
const { getAvailableClasses, enrollInClass, getAllEnrollments } = require("../Controllers/enrollmentController");

router.get("/classes", getAvailableClasses);
router.post("/enroll", enrollInClass);
router.post("/enrollments", enrollInClass);
router.get("/enrollments", getAllEnrollments);

module.exports = router;