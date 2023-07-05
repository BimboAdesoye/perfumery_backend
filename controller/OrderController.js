const ORDERS = require("../model/OrderModel.js");

const create_order_controller = async (req, res) => {
  const { firstname, lastname, mobile, address, paymentMode } = req.body;
  try {
    if (!firstname || !lastname || !mobile || !address || !paymentMode) {
      res.json({ status: "false", errMessage: "Fill all fields" });
    }

    if (mobile.length > 11) {
      res.json({ status: "false", errMessage: "mobile too long" });
    }

    const order = await ORDERS.create(req.body);
    res.status(201).json(order);

    if (!req.body) {
      res.status(400).json({ status: "false", errMessage: "Fill all fields" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const get_orders_controller = async (req, res) => {
  try {
    const allOrders = await ORDERS.find();
    res.status(200).json(allOrders);
  } catch (error) {
    res.status(400).json({ errMessage: error });
  }
};

module.exports = {
  create_order_controller,
  get_orders_controller,
};
