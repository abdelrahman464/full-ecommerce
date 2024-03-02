const asyncHandler = require("express-async-handler");
const uuidv4 = require("uuid").v4; 
// const fs = require("fs"); 
const sharp = require("sharp");
const Brand = require("../models/brandModel");
const factory = require("./handllerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const ApiError = require("../utils/apiError");

//upload Singel image
exports.uploadCategoryImage = uploadSingleImage("image");
//image processing
// Middleware for resizing an image (example purpose)
// exports.resizeImage = asyncHandler(async (req, res, next) => {
//   if (!req.file) return next(new ApiError("No file uploaded", 400));

//   const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

//   const imagePath = `uploads/brand/${filename}`;
//   fs.writeFileSync(imagePath, req.file.buffer); 
//   req.body.imagePath = imagePath; 

//   next();
// });
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No file uploaded", 400));
  }

  // Check to ensure the file is an image, this step is redundant if multer's fileFilter is set correctly
  if (!req.file.mimetype.startsWith("image")) {
    return next(new ApiError("Invalid file format, only images are allowed", 400));
  }

  // Proceed with converting and saving the image as .webp
  const filename = `brand-${uuidv4()}-${Date.now()}.webp`;
  const imagePath = `uploads/brand/${filename}`;

  try {
    await sharp(req.file.buffer)
      .webp({ quality: 90 }) // Adjust the quality as needed
      .toFile(imagePath);

    // Store the path of the converted image in req.body for further processing or database storage
    req.body.image = imagePath;
    next();
  } catch (error) {
    // Handle any errors that occur during the image processing
    next(new ApiError("Failed to process image", 500));
  }
});
//@desc get list of brand
//@route GET /api/v1/brands
//@access public
exports.getBrands = factory.getALl(Brand,"Brand");
//@desc get specific brand by id
//@route GET /api/v1/brand/:id
//@access public
exports.getBrand = factory.getOne(Brand);

//@desc create brand
//@route POST /api/v1/brands
//@access private
exports.createBrand = factory.createOne(Brand);
//@desc update specific brand
//@route PUT /api/v1/brand/:id
//@access private
exports.updateBrand = factory.updateOne(Brand);
//@desc delete brand
//@route DELETE /api/v1/brand/:id
//@access private
exports.deleteBrand = factory.deleteOne(Brand);
