const Users = require("../models/User");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const transporter = require("../utils/nodemailer");

// exports.forget = async (req, res) => {
//   try {
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email } = req.body;

//     // Check if user with email exists
//     const user = await Users.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     // Generate password reset token
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     // Save token to user's document
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//     await user.save();

//     // Send password reset email to user's email
//     const resetUrl = `${req.protocol}:${req.get(
//       "host"
//     )}/api/user/reset-password/${resetToken}`;

//     const mailOptions = {
//       from: `Prism Tech BD <jessy48@ethereal.email>`, // Use environment variables to store sender email
//       to: email,
//       subject: "Password Reset Request",
//       text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`,
//     };
//     const info = await transporter.sendMail(mailOptions);

//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//     // Preview only available when sending through an Ethereal account
//     console.log("Preview URL: %s", resetUrl);

//     return res.json({
//       msg: "Password reset email sent",
//       resetToken,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ data: err }); // Return a JSON response instead of sending a plain text response
//   }
// };

//middleware for verify user
// exports.verifyUser = async (req, res, next) => {
//   try {
//     const { email } = req.method == "GET" ? req.query : req.body;

//     await validateEmail(email);

//     const user = await Users.findOne({ email });

//     if (!user) {
//       return res.status(404).send({ error: "User not found" });
//     }

//     next();
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ error: "Authentication error" });
//   }
// };

// const validateEmail = (email) => {
//   return new Promise((resolve, reject) => {
//     if (!email) {
//       return reject({ error: "Email is required" });
//     }

//     // Use a regular expression to validate the email address
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return reject({ error: "Invalid email address" });
//     }

//     resolve();
//   });
// };

//signUp function create
exports.register = async (req, res) => {
  const { username, phone, email, password, role } = req.body;

  try {
    await checkExistingUser(username, "username");
    await checkExistingUser(email, "email");

    const hashPassword = await bcrypt.hash(password, 5);

    const user = new Users({
      username,
      password: hashPassword,
      // profile_pic: profile_pic || "",
      phone,
      email,
      role,
    });

    const result = await user.save();

    return res.status(201).send({
      msg: "User Registered Successfully ",
      status: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error });
  }
};

const checkExistingUser = (value, field) => {
  return new Promise((resolve, reject) => {
    const query = {};
    query[field] = value;

    Users.findOne(query, (error, data) => {
      if (error) return reject(error);

      if (data) {
        const errorMessage = `Please enter a unique ${field} or User Already Exist`;
        return reject({ data: errorMessage });
      }

      return resolve();
    });
  });
};

//login function controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "6d" }
    );

    return res.status(200).send({
      msg: "Login successful!",
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

//update function controller
exports.update = (req, res) => {
  const id = req.params.id;
  const Query = { _id: id };
  const reqBody = req.body;
  Users.updateOne(Query, reqBody, (error, data) => {
    if (error) {
      res
        .status(400)
        .json({ massage: "User Profile Update failed", error: error });
    } else {
      res.status(200).json({
        massage: "User updated Successfully ",
        status: data,
      });
    }
  });
};
//logout function controller
exports.logout = async (req, res) => {
  console.log(`Before Logout : ${req.headers.token}`);
  try {
    await delete req.headers["token"];
    console.log(`After Logout : ${req.headers.token}`);
    res.status(200).send({ message: "Logout Successful" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};
