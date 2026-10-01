const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        validate: {
            validator: function(check) {
                return !(/^\s+$/.test(check));//No empty white spaces allowed
                }, 
            message: "Invalid username"
            }
        },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already exists"],
        validate: {
            validator: function(check) {
                return !(/^\s+$/.test(check));//No empty white spaces allowed
                }, 
            message: "Invalid email"
            }
        },
        fullName: {
        type: String,
        required: true,
        validate: {
            validator: function(check) {
                return !(/^\s+$/.test(check));//No empty white spaces allowed
                }, 
            message: "Invalid Name"
            }
        },
        country: {
        type: String,
        required: true,
        validate: {
            validator: function(check) {
                return !(/^\s+$/.test(check));//No empty white spaces allowed
                }, 
            message: "Invalid Country"
            }
        },
        dateOfBirth: {
        type: Date,
        required: true,
        },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(check) {
                return !(/^\s+$/.test(check));//No empty white spaces allowed
              }, 
            message: "Invalid password"
            }
        },
    profileImage: {
        type: String,
    }
})

const User = mongoose.model("user", userSchema);

module.exports = User;