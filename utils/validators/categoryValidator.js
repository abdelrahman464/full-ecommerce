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
  check("description_nor")
    .notEmpty()
    .withMessage("category english description is required")
    .isLength({ min: 20 })
    .withMessage("Too short category english description")
    .isLength({ max: 2000 })
    .withMessage("Too long category english description"),
  check("description_dan")
    .notEmpty()
    .withMessage("category danish description is required")
    .isLength({ min: 20 })
    .withMessage("Too short category danish description")
    .isLength({ max: 2000 })
    .withMessage("Too long category danish description"),
  check("description_swe")
    .notEmpty()
    .withMessage("category swedish description is required")
    .isLength({ min: 20 })
    .withMessage("Too short category swedish description")
    .isLength({ max: 2000 })
    .withMessage("Too long category swedish description"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
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
  check("description_nor")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Too short category norway description")
    .isLength({ max: 2000 })
    .withMessage("Too long category norway description"),
  check("description_dan")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Too short category danish description")
    .isLength({ max: 2000 })
    .withMessage("Too long category danish description"),
  check("description_swe")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Too short category danish description")
    .isLength({ max: 2000 })
    .withMessage("Too long category danish description"),

  validatorMiddleware,
];
exports.deleteCategroyValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
