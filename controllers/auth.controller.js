import jwt from "jsonwebtoken";
import { conn, disconnect } from "../db/connect.js";
import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  // check empty data
  if (!email || !name || !password)
    return res.status(401).json({ message: "Provide correct data" });

  //  connect db
  await conn();

  // findalredy user
  const alreadyExist = await User.find({ email });
  try {
    if (alreadyExist.length > 0) {
      return res.status(403).json({ message: "user already exist" });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await disconnect();
  }

  try {
    await conn();
    // hash password
    const hashedpassword = await bcrypt.hash(password, 12);
    // save user
    const newUser = await User.create({
      name,
      email,
      password: hashedpassword,
    });

    res.status(201).json({ message: "user created successfuly" });
  } catch (error) {
    console.log(error.message);
  } finally {
    await disconnect();
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const createToken = (secret = process.env.JWT_SECRET) => {
    const token = jwt.sign(email, secret);
    return token;
  };
  // check empty data
  if (!email || !password)
    return res.status(401).json({ message: "Provide correct data" });

  //  connect db
  await conn();

  // find user
  const user = await User.find({ email });

  try {
    if (user.length < 1) {
      return res.status(403).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    await disconnect();
  }

  try {
    await conn();
    // compare password
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    // save user
    if (!passwordMatch)
      res.status(403).json({ message: "Invalid credentials" });

    const token = createToken();
    return res
      .cookie("login", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.ENV === "Development" ? false : true,
      })
      .status(200)
      .json({ message: "Login Successful" });
  } catch (error) {
    console.log(error.message);
  } finally {
    await disconnect();
  }
};

export const logoutController = (req, res) => {
  return res.clearCookie("login").status(200).json({ message: "Logout Successfuly" });
  
};
