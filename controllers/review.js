const Review = require("../models/review.js");

const Listing = require("../models/listing.js");

module.exports.newReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); //req ko body ma aako review lai review ma rakxa
    newReview.author= req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success","New review created");
    res.redirect(`/listings/${listing._id}`);
  }

  module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findOneAndUpdate(
      { _id: id },
      { $pull: { reviews: reviewId } }
    );
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
  }