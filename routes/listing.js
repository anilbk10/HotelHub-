const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage })



const { isloggedin, saveRedirectUrl, isowner,validateListing } = require("../middleware.js");
const controller = require("../controllers/listings.js");


router.route("/")
.get(wrapAsync(controller.index))   // index route
// .post( isloggedin, wrapAsync(controller.create))
.post(isloggedin, upload.single('listing[image]'),  wrapAsync(controller.create));


//new route
router.get("/new", isloggedin, controller.renderNewForm);

router.route("/:id")
.put(isloggedin,isowner, upload.single('listing[image]'),wrapAsync(controller.update))
.get(wrapAsync(controller.show))
.delete(wrapAsync(controller.delete));

//Edit route
router.get("/:id/edit",isloggedin,isowner,wrapAsync(controller.edit)
);

module.exports = router;
