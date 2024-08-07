require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const perfumeryRouters = require("./router/PerfumeryRouter");
const userRoute = require("./router/userRoute");
const orderRoute = require("./router/OrderRoute");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 2020;
const stripe = require("./router/Stripe");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

let db_url = process.env.DBURL;

// const stripe = request("stripe")(process.env.STRIPE_PRIVATE_KEY);

mongoose
  .connect(db_url)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Hello, again");
});

app.use("/auth", userRoute);

app.use("/perfumes", perfumeryRouters);

app.use("/order", orderRoute);

app.use("/stripe", stripe);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
