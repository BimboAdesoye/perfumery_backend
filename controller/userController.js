const userModel = require("../model/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRETE
    );
    console.log(token);
    console.log("Registered succesfully");
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

// Login controller
const login_controller = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res
        .status(400)
        .json({ status: "false", errMsg: "Please enter all required fields" });
      return;
    }

    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        status: "false",
        errMsg: "Wrong credentials",
      });
    }

    // Comparing Password
    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!passwordCorrect) {
      return res
        .status(400)
        .json({ status: "false", errMsg: "wrong credentials" });
    }

    // token
    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRETE
    );
    console.log("Logged in");
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

// Logout controller
const logout_controller = async (req, res) => {
  res.json({ token: "" });
};

// Logged In
const loggedIn_controller = (req, res) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      return res.json(false);
    }
    jwt.verify(token, process.env.JWT_SECRETE);
    res.json(true);
  } catch (error) {
    console.log(error);
    res.json(false);
  }
};

module.exports = {
  register_controller,
  login_controller,
  logout_controller,
  loggedIn_controller,
};
