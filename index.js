if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy=require("passport-local");
const user = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/HotelHub";
const dbUrl =process.env.ATLASDB

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// app.get("/", (req, res) => {
//   res.send("route is working");
// });
const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
   secret:process.env.SECRET
  },
  touchAfter:20*3600,
})

store.on("errer",()=>{
  console.log("Error in mongo session store",err);
})
const sessionOptions ={
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration date
    maxAge: 7 * 24 * 60 * 60 * 1000, // Set max age in milliseconds
    httpOnly:true,
  }
};


app.use(session(sessionOptions)); //for cookie and passport
app.use(flash());


app.use(passport.initialize()); //A middleware that inilizes passport
app.use(passport.session());// 
passport.use(new LocalStrategy(user.authenticate()));// Generates a function that is used in Passport's LocalStrategy
passport.serializeUser(user.serializeUser());//Generates a function thatis used by Passport to serialize(store) users into the session
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser= req.user;
  next();
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter); 
app.use("/",userRouter); 

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "somethig went wrong " } = err;
  res.status(statusCode).render("error.ejs", { err });
  next();
});

app.listen(8080, () => {
  console.log("app is listining");
});
