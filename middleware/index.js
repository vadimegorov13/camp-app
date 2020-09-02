const   Campground  = require("../models/campground"),
        Comment     = require("../models/comment");

//MIDDLEWARE
const middleware = {};

middleware.isLoggenIn = async (req, res, next) => {
    if(await req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middleware.isNotLoggedIn = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    } else {
        // req.flash("error", "You are already logged in");
        res.redirect("/campgrounds");
    };
};

middleware.checkCampgroundOwnership = async (req, res, next) => {
    //check if user logged in at all
    try {
        if(await req.isAuthenticated()){
            //does user own the campground?
            let foundCampground = await Campground.findById(req.params.id);
            if(await foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            } else{
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        }else{
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
    } catch(error){
        req.flash("error", "Campground not found");
        res.redirect("back");
    }
}

middleware.checkCommentOwnership = async (req, res, next) => {
    //check if user logged in at all
    try {
        if(await req.isAuthenticated()){
            //does user own the comment?
            let foundComment = await Comment.findById(req.params.comment_id);
            if(await foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            } else{
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        }else{
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
    } catch(error){
        req.flash("error", "Comment not found");
        res.redirect("back");
    }
}

module.exports = middleware;