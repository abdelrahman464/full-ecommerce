// database
const mongoose = require("mongoose");
//1- create schema
const categorySchema = mongoose.Schema(
  {
    name_nor: {
      type: String,
      required: [true, "category name_ar required"],

      minlength: [3, "too short category name_ar name"],
      maxlength: [32, "too long category name_ar name"],
    },
    name_dan: {
      type: String,
      required: [true, "category name_en required"],
      minlength: [3, "too short category name_en name"],
      maxlength: [32, "too long category name_en name"],
    },
    name_swe: {
      type: String,
      required: [true, "category name_en required"],
      minlength: [3, "too short category name_en name"],
      maxlength: [32, "too long category name_en name"],
    },
  },
  { timestamps: true }
);


//2- create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
