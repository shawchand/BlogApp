var express = require("express"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    passport = require("passport");
    bodyParser = require("body-parser"),
        Blog = require("./models/blog"),
        User = require("./models/users"),
        Comment = require("./models/comment"),
        LocalStrategy = require("passport-local"),
        passportLocalMongoose = require("passport-local-mongoose"),
       seedDB = require("./seeds")

seedDB();
mongoose.connect("mongodb://localhost/blog_app");

//APP CONFIG
var app = express();

app.use(require("express-session")({
    secret: "Hello World",
    resave: false,
    saveUninitialized: false
    }));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view enigine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//RESTFUL ROUTES
app.get("/", function (req,res) {
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs",function (req,res) {
    Blog.find({}, function (err, blogs) {
        if(err){
            console.log("Error!");
        } else {
            res.render("index.ejs", {blogs: blogs});
        }
    });
});

// CREATE ROUTE
app.post("/blogs", function (req,res) {
    //create blog
    Blog.create(req.body.blog, function (err, newBlog) {
        if(err){
            res.render("new");
        } else{
            res.redirect("/blogs");
        }
    });
});

// NEW FORM FOR BLOG POST ROUTE
app.get("/blogs/new",isRegisteredIn, function (req,res) {
    res.render("new.ejs");
});

//SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id).populate("comments").exec(function (err, foundBlog) {
        if(err){
            res.redirect("/blogs");
        } else {
           console.log(foundBlog);
           res.render("show.ejs", {blog: foundBlog});

        }
    })
});

//EDIT Route
app.get("/blogs/:id/edit",isLoggedIn, function (req,res){
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit.ejs", {blog: foundBlog});
        }
    })
});

//UPDATE ROUTE
app.put("/blogs/:id", function (req,res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id",isLoggedIn, function (req,res) {
     //destroy  blog
        Blog.findByIdAndRemove(req.params.id, function (err) {
            //redirect somewhere
            if(err){
                res.redirect("/blogs");
            }
            else {
                res.redirect("/blogs");
            }
        })
});


// COMMENTS ROUTE
app.get("/blogs/:id/comments/new",isLoggedIn, function (req,res) {
    //find blog by id
    Blog.findById(req.params.id, function (err, blog) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new.ejs", {blog: blog});
        }
    })
});

app.post("/blogs/:id/comments", function (req,res) {
    //lookup blog by id
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            console.log(err);
            res.render("/blogs");
        } else {
            //create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err)
                } else {
                    blog.comments.push(comment);
                    blog.save();
                    res.redirect('/blogs/' + blog._id);
                }
            });
        }
    });
});


//AUTHENTICATION ROUTES
//show sign up form
app.get("/register", function (req, res) {
    res.render("register.ejs");
});

//handling user sign up
app.post("/register", function (req, res) {
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res, function () {
            res.redirect("/blogs");
        });
    });
});

//Login Routes
app.get("/login", function (req, res) {
    res.render("login.ejs");
});

app.post("/login",passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), function (req, res) {
});

//Logout Routes
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function isRegisteredIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/register");
}


app.listen(2995, function () {
    console.log("Server is running");
});