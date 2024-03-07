const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name_nor: {
      type: String,
      trim: true,
      unique: [true, "subcategory must be unique"],
      minlength: [2, "too short subCategory name"],
      maxlength: [32, "too long subCategory name"],
    },
    name_dan: {
      type: String,
      trim: true,
      unique: [true, "subcategory must be unique"],
      minlength: [2, "too short subCategory name"],
      maxlength: [32, "too long subCategory name"],
    },
    name_swe: {
      type: String,
      trim: true,
      unique: [true, "subcategory must be unique"],
      minlength: [2, "too short subCategory name"],
      maxlength: [32, "too long subCategory name"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);


// ^find => it mean if part of of teh word contains find
subCategorySchema.pre(/^find/, function (next) {
  // this => query
  this.populate({
    path: "category",
    select: "name_nor name_dan name_swe -_id",
  });
  next();
});

const subCategory = mongoose.model("subCategory", subCategorySchema);
module.exports = subCategory;
