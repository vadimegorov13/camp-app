const   express     = require("express"),
        router      = express.Router({mergeParams:true}),
        passport    = require("passport");

const   User        = require("../models/user"),
        middleware  = require("../middleware");

//GET home page
router.get("/", (req, res) => {
    res.render("landing");
});

//SHOW register form
router.get("/register", middleware.isNotLoggedIn, (req, res) => {
    res.render("register");
});

//HANGLE sign up logic
router.post("/register", middleware.isNotLoggedIn, async (req, res) => {
    try{
        let newUser = await User({username: req.body.username});
        await User.register(newUser, req.body.password);
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Welcome to YelpCamp ${newUser.username}`);
            res.redirect("/campgrounds");
        });
    } catch(error) {
        req.flash("error", error.message);
        res.redirect("/register");
    }
});

//SHOW login form
router.get("/login", middleware.isNotLoggedIn, (req, res) => {
    res.render("login");
});

//HANDLE log in logic
router.post("/login", middleware.isNotLoggedIn, passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {
});

//HANDLE log out logic
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
});

module.exports = router;