const express = require("express");
const router = express.Router();
const { auth, isAdmin} = require("../middleware/auth");

// Routes related to Category
const {
    createCategory, 
    fetchAllCategories, 
    updateCategory, 
    deleteCategory
} = require("../controllers/Category");

router.post("/createCategory",auth, isAdmin, createCategory);
router.get("/allCategory", fetchAllCategories);
router.post("/updateCategory", updateCategory);
router.delete("/deleteCategory", deleteCategory);

// Export the router for use in the main application
module.exports = router