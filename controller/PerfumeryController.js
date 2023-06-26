const PERFUMES = require("../model/PerfumeryModel");

const create_perfume = async (req, res) => {
  const { title, description, image, category, price, label } = req.body;
  const Perfumes = new PERFUMES({
    title,
    description,
    category,
    label,
    image,
    price,
  });
  try {
    if (!title || !description || !image || !category || !label || !price) {
      res.status(404).json({ err: "All input fields should be filled!" });
    }
    if (title || description || image || category || price || label) {
      const savedPerfumes = await Perfumes.save();
      res.status(200).json(savedPerfumes);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const findAll_perfumes = async (req, res) => {
  try {
    const allPerfumes = await PERFUMES.find();
    res.status(200).json(allPerfumes);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const update_perfume = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  try {
    const updatedPerfume = await PERFUMES.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json(updatedPerfume);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const single_perfume = async (req, res) => {
  const id = req.params.id;
  try {
    const singlePerfume = await PERFUMES.findById(id);
    res.status(200).json(singlePerfume);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const get_category = async (req, res) => {
  const getCategory = await PERFUMES.find({ category: req.params.category });
  res.json(getCategory);
};

const delete_perfume = async (req, res) => {
  const id = req.params.id;
  try {
    const deletePerfume = await PERFUMES.findByIdAndDelete(id);
    res.status(200).json(deletePerfume);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

module.exports = {
  create_perfume,
  update_perfume,
  findAll_perfumes,
  single_perfume,
  get_category,
  delete_perfume,
};
