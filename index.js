process.on("unhandledRejection", (reason, promise) => {
  console.warn("Handled UnhandledRejection to prevent crash:", reason?.message || reason);
});

process.on("uncaughtException", (err) => {
  console.error("Handled UncaughtException to prevent crash:", err?.message || err);
});

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
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
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB;

if (!dbUrl) {
  console.warn("WARNING: ATLASDB environment variable is not defined!");
}

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
    console.error("MongoDB Connection Error:", err.message || err);
  });

async function main() {
  if (!dbUrl) return;
  await mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 5000,
  });
}

// Session store setup with fallback to prevent crashes if MongoDB is unreachable
let store;
if (dbUrl && process.env.USE_MEMORY_STORE !== "true") {
  try {
    store = MongoStore.create({
      mongoUrl: dbUrl,
      crypto: {
        secret: process.env.SECRET || "mysupersecretcode",
      },
      touchAfter: 20 * 3600,
    });

    if (store.clientP) {
      store.clientP.catch((err) => {
        console.warn("Mongo session store connection warning:", err.message);
      });
    }
    if (store.collectionP) {
      store.collectionP.catch((err) => {
        console.warn("Mongo session store collection warning:", err.message);
      });
    }
    store.on("error", (err) => {
      console.warn("Mongo session store error event:", err?.message || err);
    });
  } catch (err) {
    console.warn("Failed to initialize MongoStore, using MemoryStore fallback:", err.message);
  }
} else {
  console.log("Using default MemoryStore for sessions.");
}

const sessionOptions = {
  ...(store ? { store } : {}),
  secret: process.env.SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration date
    maxAge: 7 * 24 * 60 * 60 * 1000, // Set max age in milliseconds
    httpOnly: true,
  },
};

app.use(session(sessionOptions)); // for cookie and passport
app.use(flash());

app.use(passport.initialize()); // A middleware that initializes passport
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate())); // Generates a function that is used in Passport's LocalStrategy
passport.serializeUser(user.serializeUser()); // Generates a function that is used by Passport to serialize(store) users into the session
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Root redirect to /listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  let { statusCode = 500, message = "somethig went wrong " } = err;
  res.status(statusCode).render("error.ejs", { err });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
