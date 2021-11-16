const router = require("express").Router();
const connection = require("../config/database");
const UserActivity = connection.models.UserActivity;
const User = connection.models.User;

//-------------------------------------------------------------------------------------------------------------------//
//User car number plate API
//-------------------------------------------------------------------------------------------------------------------//

router.get("/number-plate", (req, res) => {
    UserActivity.find({})
        .then((user) => {
            console.log("Get all user number plates!");
            res.status(200).send(user);
        })
        .catch((err) => {
            done(err);
            res.status(400).send("No user found for numberplates!");
        });
});


router.get("/number-plate/:numberPlate", async (req, res) => {
    // const user_id = req.params.userID;
    const car_number = req.params.numberPlate;

    // console.log("User ID: ", user_id);
    console.log("Number plate: ", car_number);

    //   const user = await UserActivity.find({ user_id: req.params.userID }).sort({_id:-1}).limit(1);
    // db.messages.find( { 'headers.From': "reservations@marriott.com" }  )
    var car = User.find({ 'carDetails.carnumber': car_number}).exec();
    console.log("car response", car)
    car.then((car_details) => {
        console.log(car_details)

        console.log("car deets",car_details[0].carDetails.carnumber)
        if(car_number === car_details[0].carDetails.carnumber){
            console.log("User exists in the database");
            res.status(200).send(car_details);
        } else {
            res.status(400).send("No user found to fetch numberplates!");
        }

    })
    .catch((err) => {
        // done(err);
        res.status(400).send("Error, please try again!");
    });

});

router.get("/number-plate/user-details/:userID/:numberPlate", async (req, res) => {
    const user_id = req.params.userID;
    const car_number = req.params.numberPlate;

    console.log("User ID: ", user_id);
    console.log("Number plate: ", car_number);

    //   const user = await UserActivity.find({ user_id: req.params.userID }).sort({_id:-1}).limit(1);
    var car = UserActivity.findOne({ number_plate: car_number}).exec();
    

    console.log("car:",car[0])
    // car.then((car_details) => {
    //     console.log("Get all user number plates!");
    //     res.status(200).send(car_details);
    // })
    // .catch((err) => {
    //     done(err);
    //     res.status(400).send("No user found to fetch numberplates!");
    // });

});

module.exports = router;