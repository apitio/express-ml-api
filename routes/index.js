
const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword;
const connection = require("../config/database");
const User = connection.models.User;
const UserActivity = connection.models.UserActivity;
const isAuth = require("./authMiddleware").isAuth;
const isAdmin = require("./authMiddleware").isAdmin;


router.post("/register", (req, res, next) => {
    console.log(req.body.username);
    const saltHash = genPassword(req.body.password);


    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        hash: hash,
        salt: salt,
        admin: req.body.admin,
        email: req.body.email,
        carDetails: {
            carmodel: req.body.carmodel,
            carmake: req.body.carmake,
            caryear: req.body.caryear,
            carnumber: req.body.carnumber,
        },
    });

    newUser
        .save()
        .then((user) => {
            console.log(user);
            res.status(200).send("Succesfully registered user");
        })
        .catch((error) => {
            console.log(error);
            res.status(400).send("Bad Request")
        });
});


//Below works 11/15

var isAuthenticated = function(req,res,next){
    console.log("check isAuthenticated: ", req.sessionID)
    // console.log("check isAuthenticated res: ", res)
    if(req.user)
       return next();
    else
       return res.status(401).json({
         error: 'User not authenticated'
       })
 
 }

router.get("/",isAuthenticated, (req, res) => {
    const user = res.req.user;
    console.log("/ response:::::: ", res.req.user);
    res.send(res);
});

router.get("/api/test", (req, res, next) => {
    // res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
    res.json({ username: "Flaasdasvio" });
});


router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login-failure",
        successRedirect: "login-success",
    })
);



router.get("/user/:username/", isAuth, (req, res, next) => {
    
    if (req.isAuthenticated()) {
        res.status(200).send('User is authenticated');
    } else {
        res.status(400).send("User is not authenticated");
    }
});

router.get("/authenticated", isAuth, (req, res, next) => {
    console.log("User is authenticated")
    const user = res.req.user;
    console.log("Authetincated details: ", user)
    res.send(user);
    // res.send(JSON.stringify(check));
    // res.status(200).send(check);
});

router.get("/authenticate-user", (req, res, next) => {
    console.log("Session Details: ", req.session);
    const user = res.req.user;
    console.log("Authetincated details: ", user)
    res.send(user);

});


router.get("/protected-route", isAuth, (req, res, next) => {
    res.send("You made it to the route.");
});

router.get("/admin-route", isAdmin, (req, res, next) => {
    res.send("You made it to the admin route.");
});

router.get("/logout", (req, res, next) => {
    console.log("Logout", req.logout());
    res.send(true);
    // res.redirect('/protected-route');
});

router.get("/login-success", (req, res, next) => {
    res.status(200).send('User logged in succesfully!');
});

router.get("/login-failure", (req, res, next) => {
    res.status(400).send("Bad Request");
});



module.exports = router;
