const express = require("express");
const router = express.Router();
const {
  register_controller,
  login_controller,
  logout_controller,
} = require("../controller/userController");

// register route
router.post("/register", register_controller);

// login route
router.post("/login", login_controller);

// Logout route
router.get("/logout", logout_controller);

module.exports = router;
