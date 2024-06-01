const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");

const Listing = require("../models/listing.js");
const {validateReview, isloggedin,isowner, isauthor}= require("../middleware.js")
const controller = require("../controllers/review.js");

// reviews route
router.post(
  "/",isloggedin,
  validateReview,
  wrapAsync(controller.newReview)
);

// Delete review route
router.delete(
  "/:reviewId",isloggedin,isauthor,
  wrapAsync(controller.deleteReview)
);

module.exports = router;
