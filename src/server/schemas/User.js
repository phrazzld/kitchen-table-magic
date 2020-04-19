const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: { unique: true },
  },
  password: String,
  decks: [
    {
      name: String,
      cards: [String],
    },
  ],
  friends: [String],
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre("save", function (next) {
  const user = this;
  // hash the password if it has been changed (or created).
  // this way, the password won't be changed when a user changes their email adress.
  if (!user.isModified("password")) {
    return next();
  }
  // salt generator with hashing callback
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    // error catching
    if (err) return next(err);

    // hashing with new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      // replace the plaintext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// password verification middleware
UserSchema.methods.verifyPassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
