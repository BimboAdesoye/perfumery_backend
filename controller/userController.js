const userModel = require("../model/UserModel");
const bcrypt = require("bcryptjs");

const register_controller = async (req, res) => {
  const { email, firstname, lastname, password, passwordVerify } = req.body;
  // Validation
  try {
    if (!email || !firstname || !lastname || !password || !passwordVerify) {
      res
        .status(400)
        .json({ status: "false", errMsg: "Please enter all required fields" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        status: "False",
        errMsg: "Password length must be at least 6 characters",
      });
      return;
    }

    if (password !== passwordVerify) {
      return res
        .status(400)
        .json({ status: "false", errMsg: "Both passwords must match" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "false",
        errMsg: "Account with the same email already exists",
      });
    }

    // Hashing Password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    console.log(passwordHash);

    const newUser = new userModel({
      email,
      firstname,
      lastname,
      password: passwordHash,
    });

    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

module.exports = {
  register_controller,
};
