const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getCategoryValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid category id format"),
  //catch error
  validatorMiddleware,
];
exports.createCategroyValidator = [
  check("name_nor")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 3 })
    .withMessage("too short category name")
    .isLength({ max: 32 })
    .withMessage("too long category name"),
  check("name_dan")
    .notEmpty()
    .withMessage("category arabic danish required")
    .isLength({ min: 2 })
    .withMessage("too short category danish name ")
    .isLength({ max: 32 })
    .withMessage("too long category danish name"),
  check("name_swe")
    .notEmpty()
    .withMessage("category swedish name required")
    .isLength({ min: 2 })
    .withMessage("too short category swedish name ")
    .isLength({ max: 32 })
    .withMessage("too long category swedish name"),

  validatorMiddleware,
];
exports.updateCategroyValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  body("name_nor")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short category name")
    .isLength({ max: 32 })
    .withMessage("too long category name"),
  body("name_dan")
    .optional()
    .isLength({ min: 2 })
    .withMessage("too short category danish name ")
    .isLength({ max: 32 })
    .withMessage("too long category danish name"),
  body("name_swe")
    .optional()
    .isLength({ min: 2 })
    .withMessage("too short category swedish name ")
    .isLength({ max: 32 })
    .withMessage("too long category swedish name"),

  validatorMiddleware,
];
exports.deleteCategroyValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
