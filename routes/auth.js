var express = require("express"),
router = express.Router({mergeParams: true}),
passport = require("passport"),
User = require("../models/user");


// Roote Route
router.get('/', function(req, res) {
    res.render("landing");
});


// =================== //
//     AUTH ROUTES     //
// =================== //

// Register routes
router.get("/register", function(req, res){
    res.render('register');
})

// Register logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            req.flash("error", err.message);
            res.redirect("register");
        }
        
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    })
})


// Login routes
router.get("/login", function(req, res){
    res.render("login")
});

// Login logic
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
    
}), function(req, res){
});


// Log out route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/campgrounds");
})

module.exports = router;