var express = require("express"),
router = express.Router({mergeParams: true}),
middleware = require("../middleware"),
Campground = require("../models/campground");


// INDEX - Display all campgrounds
router.get('/', function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("campgrounds/index", {
                campgrounds: campgrounds,
                currentUser: req.user
            });
        }
    });
});


// CREATE - Add new campground to db
router.post('/', middleware.isLoggedIn, function(req, res) {
    // Get data from form and add to campgrounds db
    var newCampground = req.body;
    // Adding author
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    newCampground.author = author;
    // Save new campground to database
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            req.flash("success", "Added campground!")
            // redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    });
    
});


// NEW - Display a form to make a new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});


// SHOW - Show info about a particular campground
router.get("/:id", function(req, res) {
    var campgroundID = req.params.id;
    // Find campground
    Campground.findById(campgroundID).populate("comments").exec(function(err, campground) {
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {
                campground: campground
            });
        }
    });
});


// EDIT Route
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: campground});
        }
    })
});


// UPDATE Route
router.put("/:id", middleware.checkCampgroundOwner, function(req, res){
    //Grabbing campground
    var newCampground = req.body;
    // find and update campground
    Campground.findByIdAndUpdate(req.params.id, newCampground, function(err, campground){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            req.flash("success", "Updated campground!")
            // redirect to show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// DESTROY Route
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back")
        } else {
            req.flash("success", "Deleted campground");
            res.redirect("/campgrounds");
        }
    })
});


module.exports = router;