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
    // res.status(201).json(savedUser);
    // token
    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRETE
    );
    console.log(token);
    console.log("Registered succesfully");

    // saving token in cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
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

    // getting token from cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

// Logout controller
const logout_controller = async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) }).send();
  console.log("Logged out");
};

// Logged In
const loggedIn_controller = (req, res) => {
  try {
    // console.log(req.cookies);
    const token = req.cookies.token;
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
