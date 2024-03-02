const { check, body } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getBrandValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid brand id format"),
  //catch error
  validatorMiddleware,
];
exports.createBrandValidator = [
  check("name_nor")
    .notEmpty()
    .withMessage("brand norway name required")
    .isLength({ min: 2 })
    .withMessage("too short brand norway name")
    .isLength({ max: 32 })
    .withMessage("too long brand norway name"),
  check("name_dan")
    .notEmpty()
    .withMessage("brand danish name required")
    .isLength({ min: 2 })
    .withMessage("too short brand danish name")
    .isLength({ max: 32 })
    .withMessage("too long brand danish name"),
  check("name_swe")
    .notEmpty()
    .withMessage("brand swedish name required")
    .isLength({ min: 2 })
    .withMessage("too short brand swedish name")
    .isLength({ max: 32 })
    .withMessage("too long brand swedish name"),
  validatorMiddleware,
];
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  body("name_nor").optional(),
  body("name_dan").optional(),
  body("name_swe").optional(),
  validatorMiddleware,
];
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];
