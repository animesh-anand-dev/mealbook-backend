const express = require("express");
const router = express.Router();

// Routes related to Category
const {createCategory} = require("../controllers/Category");

router.post("/createCategory", createCategory);