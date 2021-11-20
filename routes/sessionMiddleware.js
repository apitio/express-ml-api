const connection = require("../config/database");

// const UserActivity = connection.models.UserActivity;
const sessionActivity = connection.model('sessions')

console.log(sessionActivity)