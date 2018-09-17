var methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    express = require("express"),
    app = express(),
    seedDB = require("./seeds"),
    User = require("./models/user"),
    flash = require("connect-flash");


// Requiring routes
var authRoutes = require("./routes/auth"),
    campgroundRoutes = require("./routes/campground"),
    commentsRoutes = require("./routes/comments");


// Seed function
// seedDB();


// Connecting to db
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Setting current user at locals
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error"); 
    res.locals.success = req.flash("success");
    next();
})


// Using routes
app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id", commentsRoutes);


// Starting server
app.listen('8080', '0.0.0.0', function() {
    console.log("Yelpcamp server started");
});