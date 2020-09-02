const   express     = require("express"),
        router      = express.Router({mergeParams: true});

const   Campground  = require("../models/campground"),
        Comment     = require("../models/comment"),
        middleware  = require("../middleware");

//SHOW comment form
router.get("/new", middleware.isLoggenIn, async (req, res) => {
    //FIND campground by id
    try{
        let campground = await Campground.findById(req.params.id);
        res.render("comments/new", {campground: campground});
    } catch(error) {
        console.log(error)
    }
});

//CREATE comment
router.post("/", middleware.isLoggenIn, async (req, res) => {
    //lookup campground using ID
    try{
        let [campground, comment] = await Promise.all([Campground.findById(req.params.id), Comment.create(req.body.comment)]);
        //add username and id to comments
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        //save comment
        comment.save();
        //push comment to campground and save
        campground.comments.push(comment);
        campground.save();
        // req.flash("success", "You have created a new comment");
        res.redirect(`/campgrounds/${campground._id}`);
    } catch(error) {
        console.log(error);
        res.redirect("/campgrounds");
    }
});

//EDIT comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, async (req, res) => {
    let foundComment = await Comment.findById(req.params.comment_id);
    res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
});

//UPDATE comment
router.put("/:comment_id", middleware.checkCommentOwnership, async (req, res) => {
    await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
    // req.flash("success", "You've updated your comment");
    res.redirect(`/campgrounds/${req.params.id}`);
});

//DESTROY comment
router.delete("/:comment_id", middleware.checkCommentOwnership, async(req, res) => {
    let foundComment = await Comment.findByIdAndRemove(req.params.comment_id);
    await Campground.findByIdAndUpdate(req.params.id, 
        {
            $pull: {
                comments: req.params.comment_id
            }
        }
    )
    req.flash("error", "Comment deleted!");
    res.redirect("back");
});

module.exports = router;