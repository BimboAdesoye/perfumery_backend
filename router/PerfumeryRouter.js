const express = require("express");
const router = express.Router();

const {
  create_perfume,
  update_perfume,
  findAll_perfumes,
  single_perfume,
  get_category,
  delete_perfume,
  limit_perfume
} = require("../controller/PerfumeryController");

router.post("/create", create_perfume);

router.patch("/update/:id", update_perfume);

router.get("/allPerfumes", findAll_perfumes);

router.get("/singlePerfume/:id", single_perfume);

router.get("/category/:category", get_category);

router.delete("/delete/:id", delete_perfume);

// router.get("/category/:category")

module.exports = router;
