const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");

exports.getsubCategoryValidator = [
  //rules
  check("id")
    .isMongoId()
    .withMessage("Invalid subCategory id format")
    .notEmpty()
    .withMessage("subCateogry must be belong to category"),
  //catch error
  validatorMiddleware,
];
exports.createSupCategroyValidator = [
  check("name_nor")
    .notEmpty()
    .withMessage("subCategory required")
    .isLength({ min: 3 })
    .withMessage("too short subCateogry name")
    .isLength({ max: 32 })
    .withMessage("too long subCateogry name"),
  check("name_dan")
    .notEmpty()
    .withMessage("subCategory required")
    .isLength({ min: 2 })
    .withMessage("too short subCateogry danish name ")
    .isLength({ max: 32 })
    .withMessage("too long subCateogry danish name"),
  check("name_swe")
    .notEmpty()
    .withMessage("subCategory required")
    .isLength({ min: 2 })
    .withMessage("too short subCateogry swedish name")
    .isLength({ max: 32 })
    .withMessage("too long subCateogry swedish name"),
  check("category")
    .notEmpty()
    .withMessage("subCateogry must be belong to category")
    .isMongoId()
    .withMessage("Invalid Category id format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((cateogry) => {
        if (!cateogry) {
          return Promise.reject(
            new Error(`No Category for this id : ${categoryId}`)
          );
        }
      })
    ),

  validatorMiddleware,
];
exports.updateCategroyValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid subCategory id format")
    .notEmpty()
    .withMessage("subCateogry must be belong to category"),
  check("category")
    .notEmpty()
    .withMessage("subCateogry must be belong to category")
    .isMongoId()
    .withMessage("Invalid Category id format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((cateogry) => {
        if (!cateogry) {
          return Promise.reject(
            new Error(`No Category for this id : ${categoryId}`)
          );
        }
      })
    ),
  check("name_nor")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short subCateogry name")
    .isLength({ max: 32 })
    .withMessage("too long subCateogry name"),
  check("name_den")
    .optional()
    .isLength({ min: 2 })
    .withMessage("too short subCateogry danish name ")
    .isLength({ max: 32 })
    .withMessage("too long subCateogry danish name"),
  check("name_swe")
    .optional()
    .isLength({ min: 2 })
    .withMessage("too short subCateogry swedish name ")
    .isLength({ max: 32 })
    .withMessage("too long subCateogry swedish name"),

  validatorMiddleware,
];
exports.deleteCategroyValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),
  validatorMiddleware,
];
