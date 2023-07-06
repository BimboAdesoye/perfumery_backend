const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");

const {
  create_order_controller,
  get_orders_controller,
} = require("../controller/OrderController");

router.post("/create", auth, create_order_controller);

router.get("/get", get_orders_controller);

module.exports = router;
