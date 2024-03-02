const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const Product = require("../models/productModel");
const factory = require("./handllerFactory");
const ApiError = require("../utils/apiError");

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
  if (req.body.highlights_nor) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.highlights_nor)) {
      req.body.highlights_nor = [req.body.highlights_nor];
    }
  }
  if (req.body.highlights_dan) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.highlights_dan)) {
      req.body.highlights_dan = [req.body.highlights_dan];
    }
  }
  if (req.body.highlights_swe) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.highlights_swe)) {
      req.body.highlights_swe = [req.body.highlights_swe];
    }
  }
  next();
};
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // Image processing for imageCover
  if (
    req.files.imageCover &&
    req.files.imageCover[0].mimetype.startsWith("image/")
  ) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.webp`;

    await sharp(req.files.imageCover[0].buffer)
      .toFormat("webp") // Convert to WebP
      .webp({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save imageCover file name in the request body for database saving
    req.body.imageCover = imageCoverFileName;
  } else if (req.files.imageCover) {
    return next(new ApiError("Image cover is not an image file", 400));
  }

  // Image processing for images
  if (req.files.images) {
    const imageProcessingPromises = req.files.images.map(async (img, index) => {
      if (!img.mimetype.startsWith("image/")) {
        throw new ApiError(`File ${index + 1} is not an image file.`, 400);
      }

      const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.webp`;

      await sharp(img.buffer)
        .toFormat("webp") // Convert to WebP
        .webp({ quality: 90 })
        .toFile(`uploads/products/${imageName}`);

      return imageName;
    });

    try {
      // Wait for all the images to be processed and catch any errors
      const processedImages = await Promise.all(imageProcessingPromises);
      req.body.images = processedImages;
    } catch (error) {
      return next(error);
    }
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
