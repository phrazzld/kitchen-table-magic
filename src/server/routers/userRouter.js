const express = require("express");
const passport = require("../auth.js");
const validator = require("email-validator");
const User = require("../schemas/User.js");

const userRouter = express.Router();

userRouter
  .route("/login")
  .post(
    passport.authenticate("local", { failureRedirect: "/loggedIn" }),
    (req, res) => {
      res.send("logged in");
    }
  );

userRouter.route("/register").post(async (req, res) => {
  const { email, password } = req.body;
  if (!validator.validate(email)) {
    return res.sendStatus(400);
  }
  const newUser = new User({ email, password });
  try {
    const emailInUse = await User.findOne({ email: newUser.email })
      .select("_id")
      .lean();
    if (emailInUse) {
      console.log("user attempted to create account with existing email.");
      return res.sendStatus(401);
    }
    await newUser.save();
    // await passport.authenticate('local');
    console.log(`new user created with email: ${newUser.email}`);
    await passport.authenticate("local");
    await req.logIn(newUser, (err) => {
      if (err) throw err;
    });
    // return false;
    return res.sendStatus(200);
  } catch (err) {
    console.erorr(err);
    return res.sendStatus(500);
  }
});

userRouter.route("/loggedIn").get((req, res) => {
  console.log("login attempt");
  if (req.user) {
    return res.json({ loggedIn: true, email: req.user.email });
  }
  return res.json({ loggedIn: false, email: "" });
});

userRouter
  .route("/decks")
  .get(passport.isAuthenticated, (req, res) => {
    res.send(req.user.decks);
  })
  .post(passport.isAuthenticated, (req, res) => {
    console.log(req.body);
    res.json(req.body);
  });

module.exports = userRouter;
