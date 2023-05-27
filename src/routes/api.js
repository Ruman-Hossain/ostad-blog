const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({});
const upload = multer({ storage });

const imageController = require("../controllers/imageController");
const categoryController = require("../controllers/categoryController");
const blogController = require("../controllers/blogController");
const userController = require("../controllers/userController");
const decoder = require("../middlewares/decoder");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ status: "Successfull", data:process.env });
});
router.post(
  "/singleImage",
  upload.single("profile"),
  imageController.imageUpload
);
router.post(
  "/multipleImage",
  upload.array("blog_images", 10),
  imageController.mulipleImageUpload
);

//User Routes
router.post("/user/register", userController.register);
router.post("/user/login", userController.login);
router.patch("/user/update/:id", decoder, userController.update);
// router.post("/user/forget", userController.forget);
router.post("/user/logout", decoder, userController.logout);

//Category Routes
router.post("/category/create", decoder, categoryController.create);
router.get("/category/read/:id", categoryController.read);
router.patch("/category/update/:id", decoder, categoryController.update);
router.get("/category/list", categoryController.list);
router.delete("/category/delete/:id", decoder, categoryController.delete);

//Blog Routes
// router.post("/blog/create",upload.array('properties', 12), blogController.create);
router.post("/blog/create", decoder, blogController.create);
router.get("/blog/read/:id", blogController.read);
// router.patch("/blog/update/:id", upload.array('properties', 12),blogController.update);
router.patch("/blog/update/:id", decoder, blogController.update);
router.get("/blog/list", blogController.list);
router.delete("/blog/delete/:id", decoder, blogController.delete);
router.delete("/blog/deleteAll", decoder, blogController.deleteAll);


module.exports = router;
