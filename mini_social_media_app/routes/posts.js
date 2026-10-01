const express = require("express");
const router = express.Router();

const Post = require("../models/post");
const authentication = require("../middleware/authenticate");
console.log(Post);

//retrieve post

router.get('/api/posts', async(req, res, next) => {
    try {
        const getPost = await Post.find();
        res.json(getPost);
    }
    catch (error) {
    next(error)
}
})



    //send post
router.post("/api/posts", authentication, async(req, res, next) => {
    try {
        const postPost = await Post.create({content: req.body.content, userId: req.userId });
        res.json(postPost);
    }
    catch (error) {
        next(error);
    }
    
})

//update a post
router.put("/api/posts/:postID", async(req, res, next) => {
    try {
        const postID = req.params.postID;
        const post = await Post.findByIdAndUpdate(postID, {content: req.body.content}, {new: true});
        if (!post) {
            res.status(404).send("Post not found");
            return
        }
        res.status(200).json(post);
    }
    catch (error) {
        next(error);
    }
})

//delete post
router.delete("/api/posts/:postID", async(req, res, next) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.postID);
        if (!deletedPost) {
            res.status(404).send("post not found");
            return;
        }
        res.status(200).json(deletedPost);
    }
    catch (error) {
        next(error);
    }
})


module.exports = router;