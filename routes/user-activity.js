const router = require("express").Router();
const connection = require("../config/database");
const UserActivity = connection.models.UserActivity;


//-------------------------------------------------------------------------------------------------------------------//
//User check-in and check-out API
//-------------------------------------------------------------------------------------------------------------------//

router.post("/user-activity/check-in", (req, res) => {
  console.log(req);

  const newUserActivity = new UserActivity({
    user_id: req.body.user_id,
    number_plate: req.body.number_plate,
    check_in: req.body.check_in,
    check_out: req.body.check_out,
    active: req.body.active,
  });

  newUserActivity
    .save()
    .then((user_activity) => {
      console.log(user_activity);
      res.status(200).send("User checked in");
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Bad Request");
    });
});

router.get("/user-activity", (req, res) => {
  // const user_id = req.body.user_id;
  // console.log("called get user acitivity", req.body.user_id);
  UserActivity.find({})
    .then((user) => {
      console.log("Found users");
      res.status(200).send(user);
    })
    .catch((err) => {
      done(err);
      res.status(400).send("User does not exist!");
    });
});

router.get("/user-activity/:userID", async (req, res) => {
  console.log(req.params.userID);
  //   const user = await UserActivity.find({ user_id: req.params.userID }).sort({_id:-1}).limit(1);
  UserActivity.find({ user_id: req.params.userID })
    .sort({ _id: -1 })
    .limit(1)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      done(err);
      res.status(400).send("Bad Request");
    });
});

router.get("/user-activity/all-activity/:userID", async (req, res) => {
  console.log(req.params.userID);
  //   const user = await UserActivity.find({ user_id: req.params.userID }).sort({_id:-1}).limit(1);
  UserActivity.find({ "user_id": req.params.userID })
    .then((user) => {
      console.log("user deetssss: ", user);
      res.status(200).send(user);
    })
    .catch((err) => {
      done(err);
      res.status(400).send("Bad Request");
    });
});


router.post("/user-activity/check-out/:userID", async (req, res) => {
  const user_id = req.params.userID;
  const check_out_time = req.body.check_out;
  const active_status = req.body.status;

  console.log("user id: ", req.params.userID);
  console.log("current time:", check_out_time);
  console.log("active_status:", active_status);

  const user = await UserActivity.find({ user_id: user_id })
    .sort({ _id: -1 })
    .limit(1);

  const object_id = user[0]._id.toString();

  console.log("object id: ", object_id);

  if (user[0].active == true) {

    UserActivity.findByIdAndUpdate(
      { _id: object_id },
      { check_out: check_out_time, active: active_status },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }
    );

  }

});

module.exports = router;
