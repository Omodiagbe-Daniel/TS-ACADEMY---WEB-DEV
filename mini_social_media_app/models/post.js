const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        validate: {
            validator: function(check) {
                console.log("VALIDATING: ", JSON.stringify(check));
                return !(/^\s+$/.test(check));//No empty white spaces allowed
            }, 
            message: "Empty white spaces are not allowed"
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
})

const Post = mongoose.model("post", postSchema);


console.log("Post model inside POST.js", Post)
module.exports = Post;