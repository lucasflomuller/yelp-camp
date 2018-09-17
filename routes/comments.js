var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    Comment = require("../models/comment");

// ======================================== //
// COMMENTS ROUTES
// ======================================== //


// Comments New
router.post("/comments", middleware.isLoggedIn, function(req, res) {
    // find campground by ID
    var campgroundID = req.params.id;
    Campground.findById(campgroundID, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to show page of campgrounds
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});

// DELETE Route for comments
router.delete("/comments/:comment_id", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("Comment was deleted");
            res.redirect("back");
        }
    })
});


module.exports = router;