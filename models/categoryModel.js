// database
const mongoose = require("mongoose");
//1- create schema
const categorySchema = mongoose.Schema(
  {
    name_ar: {
      type: String,
      required: [true, "category name_ar required"],
      unique: [true, "category name_ar must be unique"],
      minlength: [3, "too short category name_ar name"],
      maxlength: [32, "too long category name_ar name"],
    },
    name_en: {
      type: String,
      required: [true, "category name_en required"],
      unique: [true, "category name_en must be unique"],
      minlength: [3, "too short category name_en name"],
      maxlength: [32, "too long category name_en name"],
    },
    description_ar: {
      type: String,
      required: [true, "category description is required"],
      trim: true,
      minlength: [20, "Too short category description"],
    },
    description_en: {
      type: String,
      required: [true, "category description is required"],
      trim: true,
      minlength: [20, "Too short category description"],
    },
    imageCover: {
      type: String,
      required: [true, "category image cover is required"],
    },
    images: [String],
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
categorySchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
categorySchema.post("save", (doc) => {
  setImageURL(doc);
});

//2- create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
