const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const Product = require("../models/productModel");
const factory = require("./handllerFactory");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 10,
  },
]);
exports.convertToArray = (req, res, next) => {
  if (req.body.subCategories) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.subCategories)) {
      req.body.subCategories = [req.body.subCategories];
    }
  }
  if (req.body.colors) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.colors)) {
      req.body.colors = [req.body.colors];
    }
  }
  if (req.body.sizes) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.sizes)) {
      req.body.sizes = [req.body.sizes];
    }
  }
  if (req.body. highlights_ar) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body. highlights_ar)) {
      req.body. highlights_ar = [req.body. highlights_ar];
    }
  }
  if (req.body. highlights_en) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body. highlights_en)) {
      req.body. highlights_en = [req.body. highlights_en];
    }
  }
  next();
};

//image processing
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
         
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }

  next();
});
//@desc get list of products
//@route GET /api/v1/products
//@access public
exports.getProducts = factory.getALl(Product, "Product");
//@desc get specific product by id
//@route GET /api/v1/products/:id
//@access public
exports.getProduct = factory.getOne(Product, "reviews");
//@desc create product
//@route POST /api/v1/products
//@access private
exports.createProduct = factory.createOne(Product);
//@desc update specific product
//@route PUT /api/v1/products/:id
//@access private
exports.updateProduct = factory.updateOne(Product);

//@desc delete product
//@route DELETE /api/v1/products/:id
//@access private
exports.deleteProduct = factory.deleteOne(Product);
