const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getCategoryValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid category id format"),
  //catch error
  validatorMiddleware,
];
exports.createCategroyValidator = [
  check("name_en")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 3 })
    .withMessage("too short category name")
    .isLength({ max: 32 })
    .withMessage("too long category name"),
  check("name_ar")
    .notEmpty()
    .withMessage("category arabic name required")
    .isLength({ min: 2 })
    .withMessage("too short category arabic name ")
    .isLength({ max: 32 })
    .withMessage("too long category arabic name"),
  check("description_en")
    .notEmpty()
    .withMessage("Product english description is required")
    .isLength({ min: 20 })
    .withMessage("Too short Product english description")
    .isLength({ max: 2000 })
    .withMessage("Too long Product english description"),
  check("description_ar")
    .notEmpty()
    .withMessage("Product arabic description is required")
    .isLength({ min: 20 })
    .withMessage("Too short Product arabic description")
    .isLength({ max: 2000 })
    .withMessage("Too long Product arabic description"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  validatorMiddleware,
];
exports.updateCategroyValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  body("name_en").optional(),
  body("name_ar").optional(),
  validatorMiddleware,
];
exports.deleteCategroyValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
