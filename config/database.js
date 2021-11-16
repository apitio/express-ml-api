const mongoose = require('mongoose');

require('dotenv').config();


const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    firstname: String,
    lastname: String,
    email: { type: String, unique: true },
    hash: String,
    salt: String,
    admin: Boolean,
    carDetails: {
        carmodel: String, 
        carmake: String, 
        caryear: String, 
        carnumber: String
    },
});

const UserActivitySchema = new mongoose.Schema({
    user_id: String,
    number_plate: String,
    check_in: Date,
    check_out: Date,
    active: Boolean,
});

const UserActivityName = 'User Parking Activity'


const User = connection.model('User', UserSchema);
const UserActivity = connection.model('UserActivity', UserActivitySchema, UserActivityName);

module.exports = connection;