const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controllers= require("../controllers/user.js")


router.route("/signup")
.get( controllers.renderSignupForm)   // Route to render signup form
.post(controllers.signup);      // Route to handle signup logic

router.route("/login")
.get(controllers.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local", {failureRedirect: "/login",failureFlash: true}),controllers.login)

router.get("/logout",controllers.logout);
module.exports = router;
//passport.authenticate is a middleware which  is use in to authenticate
