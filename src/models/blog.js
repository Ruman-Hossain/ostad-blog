const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    blog_images: {
      type: [String],
      validate: {
        validator: function (images) {
          return Array.isArray(images) && images.length > 0;
        },
        message: "At least one blog image is required",
      },
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
