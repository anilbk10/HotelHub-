const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controllers = require("../controllers/user.js");
const mongoose = require("mongoose");

const checkDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    req.flash("error", "Database is offline (authentication failed). Please check database credentials.");
    return res.redirect(req.originalUrl.includes("login") ? "/login" : "/signup");
  }
  next();
};

router.route("/signup")
  .get(controllers.renderSignupForm)
  .post(checkDb, controllers.signup);

router.route("/login")
  .get(controllers.renderLoginForm)
  .post(checkDb, saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), controllers.login);

router.get("/logout", controllers.logout);

module.exports = router;
