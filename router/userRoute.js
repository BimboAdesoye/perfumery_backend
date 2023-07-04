const express = require("express");
const router = express.Router();
const { register_controller } = require("../controller/userController");

router.post("/register", register_controller);

module.exports = router;
