const Blog = require("../models/blog");
const cloudinary = require("../utils/cloudinary");

exports.create = async (req, res) => {
  try {
    const { title, description, blog_images, author, content, date } = req.body;

    // Check if Blog already exists in the database
    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return res
        .status(400)
        .json({ success: false, message: "Blog already exists" });
    }

    // Validate request body fields
    if (
      !title ||
      !description ||
      !blog_images ||
      !author ||
      !content ||
      !date
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Create Blog document
    const newBlog = new Blog({
      title,
      description,
      blog_images,
      author,
      content,
      date,
    });
    await newBlog.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Blog created successfully",
        data: newBlog,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create Blog",
        error: error.message,
      });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const options = { new: true };

    const updatedBlog = await Blog.findByIdAndUpdate(id, updates, options);

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Blog",
      error: error.message,
    });
  }
};

exports.list = async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (!blogs.length) {
      return res.status(404).json({
        success: false,
        message: "No Blog Data found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog Data retrieved successfully",
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve Blog",
      error: error.message,
    });
  }
};

exports.read = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve Blog",
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Blog",
      error: error.message,
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const result = await Blog.deleteMany({});
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} Blogs successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Blogs",
      error: error.message,
    });
  }
};
