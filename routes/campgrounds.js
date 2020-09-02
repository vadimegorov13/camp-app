const   express = require("express"),
        router  = express.Router();

const   Campground = require("../models/campground"),
        middleware = require("../middleware");

        
//GET all campgrounds
router.get("/", async (req, res) => {
    try{
        var noMatch = null;
        if(req.query.search){
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            let campgrounds = await Campground.find({name: regex});
            if(campgrounds.length < 1){
                noMatch = "No campground match that query, please try again.";
            }
            res.render("campgrounds/index", {campgrounds: campgrounds, noMatch: noMatch});
        }else{
            let campgrounds = await Campground.find({});
            res.render("campgrounds/index", {campgrounds: campgrounds, noMatch: noMatch});
        }
    }catch(error){
        console.log(error);
    }
});

//GET form to create new campground
router.get("/new", middleware.isLoggenIn, (req, res) => {
    res.render("campgrounds/new");
});

//CREATE new campground
router.post("/", middleware.isLoggenIn, async (req, res) => {
    try{
        let author = {
            id: req.user._id,
            username: req.user.username
        };
        let name = req.body.name;
        let image = req.body.image;
        let desc = req.body.description;
        let price = req.body.price;
        let newCampground = {name: name, image: image, description: desc, price: price, author: author};

        await Campground.create(newCampground);
        // req.flash("success", "You have created a new campground");
        res.redirect("/campgrounds");
    } catch(error) {
        console.log(error);
    }
});

//SHOW more info about one campground
router.get("/:id", async (req, res) => {
    //Find the campground ID
    try{
        let foundCampground = await Campground.findById(req.params.id).populate("comments");
        res.render("campgrounds/show", {campground: foundCampground});
    } catch(error) {
        console.log(error);
    }
});

//EDIT campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, async (req, res) => {
    let foundCampground = await Campground.findById(req.params.id);
    
    res.render("campgrounds/edit", {campground: foundCampground});
});


//UPDATE campground
router.put("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
    //find and update the correct campground
    let foundCampground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash("success", `You've updated ${foundCampground.name}`);
    res.redirect(`/campgrounds/${req.params.id}`);
});

//DESTROY campground
router.delete("/:id", middleware.checkCampgroundOwnership, async(req, res) => {
    let foundCampground = await Campground.findById(req.params.id);
    req.flash("error", `You have deleted ${foundCampground.name}`);
    await foundCampground.remove();
    res.redirect("/campgrounds");
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;