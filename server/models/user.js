const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// const EntrySchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
// });

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },
  interests: {
    type: [String],
    required: false,
  },
  favoriteBreeds: {
    type: [String],
  },
  currentPets: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  picture: {
    data: Buffer,
    contentType: String,
  },
});

// UserSchema.pre('save', async function (next) {
//   if (this.isModified('password') || this.isNew) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }

//   next();
// });

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
