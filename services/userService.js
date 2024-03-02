const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factory = require("./handllerFactory");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

//upload Singel image
exports.uploadProfileImage = uploadSingleImage("profileImg");
//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No file uploaded", 400));
  }

  // Check to ensure the file is an image, this step is redundant if multer's fileFilter is set correctly
  if (!req.file.mimetype.startsWith("image")) {
    return next(new ApiError("Invalid file format, only images are allowed", 400));
  }

  // Proceed with converting and saving the image as .webp
  const filename = `profileImg-${uuidv4()}-${Date.now()}.webp`;
  const imagePath = `uploads/users/${filename}`;

  try {
    await sharp(req.file.buffer)
      .webp({ quality: 95 }) // Adjust the quality as needed
      .toFile(imagePath);

    // Store the path of the converted image in req.body for further processing or database storage
    req.body.profileImg = imagePath;
    next();
  } catch (error) {
    // Handle any errors that occur during the image processing
    next(new ApiError("Failed to process image", 500));
  }
});
//@desc get list of user
//@route GET /api/v1/users
//@access private
exports.getUsers = factory.getALl(User);
//@desc get specific User by id
//@route GET /api/v1/User/:id
//@access private
exports.getUser = factory.getOne(User);
//@desc create user
//@route POST /api/v1/users
//@access private
exports.createUser = factory.createOne(User);
//@desc update specific user
//@route PUT /api/v1/user/:id
//@access private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`No document For this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: user });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`No document For this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});
//@desc delete User
//@route DELETE /api/v1/user/:id
//@access private
exports.deleteUser = factory.deleteOne(User);
//@desc get logged user data
//@route GET /api/v1/user/getMe
//@access private/protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  // i will set the req,pararms.id because i will go to the next middleware =>>> (getUser)
  req.params.id = req.user._id;
  next();
});
//@desc update logged user password
//@route PUT /api/v1/user/changeMyPassword
//@access private/protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  //update user password passed on user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  //genrate token
  const token = generateToken(req.user._id);

  res.status(200).json({ data: user, token });
});
//@desc update logged user data without updating password or role
//@route PUT /api/v1/user/changeMyData
//@access private/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );
  res.status(200).json({ data: user });
});
//@desc deactivate logged user
//@route DELETE /api/v1/user/deleteMe
//@access private/protect
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).send();
});
//@desc activate logged user
//@route PUT /api/v1/user/activeMe
//@access private/protect
exports.activeLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: true });
  res.status(201).json({ data: "success" });
});
