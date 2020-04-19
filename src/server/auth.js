const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./schemas/User.js");

passport.use(
  new LocalStrategy((email, password, done) => {
    // add local strategy for logging in
    User.findOne({ email }, (err, user) => {
      // find the specified user
      if (err) return done(err);
      if (!user) return done(null, false);
      user.verifyPassword(password, (err, isMatch) => {
        // verify their password
        if (!isMatch) return done(null, false);
        return done(null, user);
      });
    });
  })
);

passport.serializeUser((user, done) => {
  // serialize user method
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // deserialize user method
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.isAuthenticated = (req, res, next) => {
  if (req.user != null) {
    next();
  } else {
    return res.status(401).redirect("/login");
  }
};

module.exports = passport;
