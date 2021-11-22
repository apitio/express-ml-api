
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


router.post("/update-user", async (req, res, next) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;

    console.log(firstname, lastname, username, email);

    var query = {
        'firstname': firstname,
        'lastname': lastname,
        'username': username,
        'email': email
    };

    const filter = { username: username };

    try {
        let doc = await User.findOneAndUpdate(filter, query, {
            new: true
        });
        res.status(200).send(doc);

    } catch (error) {
        console.log("Error in updating doc!")
        res.status(400).send("Unable to update. Bad Request!");
    }

});

router.post("/update-car-details", async (req, res, next) => {
    const username = req.body.username;
    const carmodel = req.body.carmodel;
    const carmake = req.body.carmake;
    const caryear = req.body.caryear;
    const carnumber = req.body.carnumber;

    console.log(username, carmodel, carmake, caryear, carnumber);

    var query = {
        'carmodel': carmodel,
        'carmake': carmake,
        'caryear': caryear,
        'carnumber': carnumber
    };

    try {
        await User.updateOne(
            {
                username: username,
            },
            {
                $set: { carDetails: query },
            },
            {
                upsert: true,
                runValidators: true
            }
        );

        res.status(200).send("Updated user details");

    } catch (error) {
        console.log("Error in updating doc!")
        res.status(400).send("Unable to update. Bad Request!");
    }


});


//Below works 11/15

router.get("/", (req, res) => {
    const user = res.req.user;
    console.log("User details: ", user)
    res.send(user);
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
    // console.log("Authetincated details:")
    res.send(user);
    // res.send(JSON.stringify(check));
    // res.status(200).send(check);
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
