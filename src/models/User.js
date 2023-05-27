const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter a username."],
    },
    email: {
      type: String,
      required: [true, "Please enter an email address."],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          // Regex pattern for email validation
          return /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(value);
        },
        message: "Please enter a valid email address.",
      },
    },
    phone: {
      type: String,
      required: [true, "Please enter a phone number."],
      unique: true,
      validate: {
        validator: function (value) {
          // Regex pattern for Bangladeshi phone number validation
          return /^\+880 \d{4}-\d{6}$/.test(value);
        },
        message: "Please enter a valid Bangladeshi phone number in the format: +880 XXXX XXXXXX",
      },
    },
    
    password: {
      type: String,
      required: [true, "Please enter a password."],
      minlength: [6, "Password must be at least 6 characters long."],
    },
    role: {
      type: String,
      default: "subscriber",
    },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
