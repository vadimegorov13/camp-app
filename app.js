const   bodyParser       = require("body-parser"),
        mongoose         = require("mongoose"),
        config           = require("./config/key"),
        express          = require("express"),
        app              = express(),
        passport         = require("passport"),
        localStrategy    = require("passport-local"),
        methodOverride   = require("method-override"),
        flash            = require("connect-flash");
    
const   User             = require("./models/user"),
        seedDB           = require("./seeds");

const   campgroundRoutes = require("./routes/campgrounds"),
        commentRoutes    = require("./routes/comments"),
        indexRoutes      = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//CONNECT DB
mongoose.connect(config.mongoURI,
    {
        useNewUrlParser: true, useUnifiedTopology: true,
        useCreateIndex: true, useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "YelpCamp secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Gives data from current user to every template/route
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//ROUTES
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//LISTEN
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Server is runnig on port " +  port);
});