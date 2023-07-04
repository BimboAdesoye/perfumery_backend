const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const perfumeryRouters = require("./router/PerfumeryRouter");
const userRoute = require("./router/userRoute");
const port = process.env.PORT || 2020;

require("dotenv").config();
app.use(cors());
app.use(express.json());

let db_url = process.env.DBURL;

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
