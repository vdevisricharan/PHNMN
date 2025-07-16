const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [30, "Username must be less than 30 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

UserSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Duplicate field value entered.'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("User", UserSchema);