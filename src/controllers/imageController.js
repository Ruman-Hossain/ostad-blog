const Test = require('../models/Test');
const MultiImage = require('../models/Test')
const cloudinary = require('../utils/cloudinary');
exports.imageUpload = async (req, res) => {
  try{
    const temp={
      profile: req.file.path,
      name: req.body.name,
      email:req.body.email,
    }
    console.log(temp.profile);
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);
    const reqBody = {
      name:  temp.name,
      email: temp.email,
      profile: result.secure_url
    }
    //res.status(200).json(reqBody);
    const data = await Test.create(reqBody);
    res.status(200).json({ status: "Success", data: data });
  } catch (error) {
    res.status(400).json({ status:'Failed', data: error });
  }
}

exports.mulipleImageUpload = async (req, res) => {
  try{
    const temp={
      blog_images: req.files,
    }
    console.log(temp.blog_images);
    const uploadPromises = temp.blog_images.map(file => cloudinary.uploader.upload(file.path));
    const results = await Promise.all(uploadPromises);
    const urls = results.map(result => result.secure_url);
    const reqBody = {
      blog_images: urls
    }
    console.log(reqBody.blog_images);
    const data = await MultiImage.create(reqBody);
    res.status(200).json({ status: "Success", data: data });
  } catch (error) {
    res.status(400).json({ status:'Failed', data: error.message });
  }
}