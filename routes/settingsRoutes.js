
const express = require("express");
const addAdminController = require("../controllers/addAdminController");
const router = express.Router();
const isAuthenticated = require("../middleware/authMiddleware");


router.get("/", isAuthenticated, (req, res) => {
    const user = {
        name: "Rheya",
        role: "Admin",
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=faces",
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

// Add New Admin page route
router.get("/addNewAdmin", isAuthenticated, (req, res) => {
    res.render("settings", {
        user: req.user,
        activeSidebar: "addNewAdmin"
    });
});

// Handle the POST request for adding new admin
router.post("/addNewAdmin", addAdminController.addNewAdmin);

module.exports = router;