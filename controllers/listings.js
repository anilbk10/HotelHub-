const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
let mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listing/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.create = async (req, res, next) => {
  let listing = req.body.listing;
  const newListing = new Listing(listing);

  let response= await geocodingClient
  .forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
      .send()

  let url = req.file.path;
  let filename = req.file.filename;
  
  // const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // to add id/username in new post acc to login
  newListing.image = { url, filename };
  newListing.geometry=response.body.features[0].geometry;
  await newListing.save();

  req.flash("success", "New listing created");
  res.redirect(`/listings`);
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", " Listing does not exist");
    res.redirect("/listings");
  }
  let orginalUrl = listing.image.url;
  orginalUrl = orginalUrl.replace("/upload", "/upload/h_300,w_300");
  res.render("listing/edit.ejs", { listing, orginalUrl });
};

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  res.redirect(`/listings/${id}`);
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", " Listing does not exist");
    res.redirect("/listings");
  }

  res.render("listing/show.ejs", { listing });
  console.log(listing);
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  let delData = await Listing.findOneAndDelete({ _id: id });
  console.log(delData);
  req.flash("success", "A listing was deleted");
  res.redirect("/listings");
};
