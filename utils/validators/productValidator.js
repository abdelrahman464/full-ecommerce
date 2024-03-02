const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");
const Brand = require("../../models/brandModel");
const ApiError = require("../apiError");

exports.createProductValidator = [
  check("title_nor")
    .notEmpty()
    .withMessage("product norway name required")
    .isLength({ min: 3 })
    .withMessage("product norway name must be at least 3 chars"),
  check("title_dan")
    .isLength({ min: 3 })
    .withMessage("product danish name must be at least 3 chars")
    .notEmpty()
    .withMessage("product danish name required"),
  check("title_swe")
    .isLength({ min: 3 })
    .withMessage("product swedish name must be at least 3 chars")
    .notEmpty()
    .withMessage("product swedish name required"),
  check("shortDescription_nor")
    .notEmpty()
    .withMessage("Product norway description is required")
    .isLength({ min: 10 })
    .withMessage("Too short Product norway description")
    .isLength({ max: 300 })
    .withMessage("Too long Product norway description"),
  check("shortDescription_dan")
    .notEmpty()
    .withMessage("Product danish description is required")
    .isLength({ min: 10 })
    .withMessage("Too short Product danish description")
    .isLength({ max: 300 })
    .withMessage("Too long Product danish description"),
  check("shortDescription_swe")
    .notEmpty()
    .withMessage("Product swedish description is required")
    .isLength({ min: 10 })
    .withMessage("Too short swedish arabic description")
    .isLength({ max: 300 })
    .withMessage("Too long swedish arabic description"),
  check("description_nor")
    .notEmpty()
    .withMessage("Product norway description is required")
    .isLength({ min: 20 })
    .withMessage("Too short Product norway description")
    .isLength({ max: 1000 })
    .withMessage("Too long Product norway description"),
  check("description_dan")
    .notEmpty()
    .withMessage("Product danish description is required")
    .isLength({ min: 20 })
    .withMessage("Too short Product danish description")
    .isLength({ max: 1000 })
    .withMessage("Too long Product danish description"),
  check("description_swe")
    .notEmpty()
    .withMessage("Product swedish description is required")
    .isLength({ min: 20 })
    .withMessage("Too short Product swedish description")
    .isLength({ max: 1000 })
    .withMessage("Too long Product swedish description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),

  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    // before i add product to category i must check if category is in database
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new ApiError(`No category for this id: ${categoryId}`, 404)
          );
        }
      })
    ),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("subCategories should be array of string")
    .isMongoId()
    .withMessage("Invalid ID format")
    //check subcategories exist in databse befor add product to subcats
    // _id:{exists:true} => filter subcats by id => gives me subcats that have id
    //_id:{exists:true,$in :subCategoriesIds} =>  first i checked if the subcats have id second i checked if these ids in the array of subcats that i send in body
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(
              new ApiError(`Invalid subcategories Ids`, 403)
            );
          }
        }
      )
    )
    // make sure that subcategories from body belongs to cateogry from body
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = [];
          subcategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });
          // check if subcategories ids in db include subcategories in req.body (true)
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoriesIdsInDB)) {
            return Promise.reject(
              new ApiError(`subcategories not belong to category`, 403)
            );
          }
        }
      )
    ),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((brandId) =>
      Brand.findById(brandId).then((brand) => {
        if (!brand) {
          return Promise.reject(new Error(`No brand for this id : ${brandId}`));
        }
      })
    ),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  //catch error and return it as a response
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  check("title_nor")
    .optional()
    .isLength({ min: 3 })
    .withMessage("product norway name must be at least 3 chars"),
  check("title_dan")
    .isLength({ min: 3 })
    .withMessage("product danish name must be at least 3 chars")
    .optional(),
  check("title_swe")
    .isLength({ min: 3 })
    .withMessage("product swedish name must be at least 3 chars")
    .optional(),
  check("shortDescription_nor")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Too short Product norway description")
    .isLength({ max: 300 })
    .withMessage("Too long Product norway description"),
  check("shortDescription_dan")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Too short Product danish description")
    .isLength({ max: 300 })
    .withMessage("Too long Product danish description"),
  check("shortDescription_swe")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Too short Product swedish description")
    .isLength({ max: 300 })
    .withMessage("Too long Product swedish description"),
  check("description_nor")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Too short Product norway description")
    .isLength({ max: 1000 })
    .withMessage("Too long Product norway description"),
  check("description_dan")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Too short Product danish description")
    .isLength({ max: 1000 })
    .withMessage("Too long Product danish description"),
  check("description_swe")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Too short Product swedish description")
    .isLength({ max: 1000 })
    .withMessage("Too long Product swedish description"),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),

  check("imageCover").optional(),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    // before i add product to category i must check if category is in database
    .custom((categoryId) =>
      Category.findById(categoryId).then((cateogry) => {
        if (!cateogry) {
          return Promise.reject(
            new Error(`No Category for this id : ${categoryId}`)
          );
        }
      })
    ),
  check("highlights_nor")
    .optional()
    .isArray()
    .withMessage("highlights norway should be array of string"),
  check("highlights_dan")
    .optional()
    .isArray()
    .withMessage("highlights danish should be array of string"),
  check("highlights_swe")
    .optional()
    .isArray()
    .withMessage("highlights swedish should be array of string"),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("subCategories should be array of string")
    .isMongoId()
    .withMessage("Invalid ID format")
    //check subcategories exist in databse befor add product to subcats
    // _id:{exists:true} => filter subcats by id => gives me subcats that have id
    //_id:{exists:true,$in :subCategoriesIds} =>  first i checked if the subcats have id second i checked if these ids in the array of subcats that i send in body
    .custom((subCategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subCategoriesIds } }).then(
        (result) => {
          //Length result  must equal  subcats in body
          if (result.length < 1 || result.length !== subCategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subCateogries Ids`));
          }
        }
      )
    )
    // make sure that subcategories from body belongs to cateogry from body
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = [];
          subcategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });

          // check if subcategories ids in db include subcategories in req.body (true)
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoriesIdsInDB)) {
            return Promise.reject(
              new Error(`subcategories not belong to category `)
            );
          }
        }
      )
    ),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format") // before i add product to category i must check if category is in database
    .custom((brandId) =>
      Brand.findById(brandId).then((brand) => {
        if (!brand) {
          return Promise.reject(new Error(`No brand for this id : ${brandId}`));
        }
      })
    ),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];
