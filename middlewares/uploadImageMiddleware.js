const multer = require("multer");
const ApiError = require("../utils/apiError");

// Configure multer for image upload
const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only image files are allowed!", 400), false);
    }
  };

  return multer({ storage: multerStorage, fileFilter: multerFilter });
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
