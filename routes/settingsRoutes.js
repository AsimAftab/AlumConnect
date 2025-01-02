const express = require("express");
const addAdminController = require("../controllers/addAdminController");
const router = express.Router();
const isAuthenticated = require("../middleware/authMiddleware");

// Settings Route
router.get("/settings", isAuthenticated, (req, res) => {
  const user = {
    name: "Rheya",
    role: "Admin",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=faces",
    fullname: "Rheya Kumar",
    email: "rheya@example.com",
    phone: "9876543210",
  };
  const activeSidebar = req.query.sidebar || "accountSettings";
  res.render("settings", {
    user: user,
    activeSidebar: activeSidebar,
  });
});

// Add New Admin Route (under settings)
router.get("/settings?sidebar=addNewAdmin", isAuthenticated, (req, res) => {
  const admin = { name: "", email: "" };
  res.render("addNewAdmin", { admin });
});

// Handle the POST request to add new admin

// Needs a fix at backend
router.post(
  "/settings?sidebar=addNewAdmin",
  isAuthenticated,
  addAdminController.addNewAdmin,
);

module.exports = router;
