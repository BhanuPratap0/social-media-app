const router = require("express").Router();
const Post = require('../models/Post')
const User = require('../models/User')
const Comments = require('../models/Comments');
var cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: 'dns2pagvz',
    api_key: '786853166771752',
    api_secret: '7nLAicQ70OW-fgaYCur-m31nYTk'
});

//delete a image
router.delete("/delete-image/:id", async (req, res) => {
    try {
        const public_id = req.params.id;
        cloudinary.uploader.destroy(public_id, 
            function (result) { console.log(result) });
        res.status(200).json("Image Deleted");
    } catch (error) {
        res.status(500).json(error);
    }
})




//create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
})

//update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId == req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Post has been updated")
        } else {
            res.status(403).json("You can update only your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

//delete a post

router.delete("/:id/:userId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId == req.params.userId) {
            await post.deleteOne();
            return res.status(200).json("Post has been deleted")
        } else {
            return res.status(403).json("You can delete only your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

//like a post

router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("Post liked")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("Post disliked")
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

//get a post

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
})

//get all posts of the users following(Timeline)

router.get("/timeline/:userId", async (req, res) => {

    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendsPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        )
        res.status(200).json(userPosts.concat(...friendsPosts));
    } catch (error) {
        res.status(500).json(error);
    }
})

//get user posts only
router.get("/profile/:username", async (req, res) => {

    try {
        const user = await User.findOne({ username: req.params.username })
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }

})

//post a comment 
router.post("/comments", async (req, res) => {
    const newComment = new Comments(req.body);
    try {
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (error) {
        res.status(500).json("Error posting comment")
    }
})

//fetch comments

router.get("/getcomments/:postId", async(req,res) => {
    try {
        const allComments = await Comments.find({postId : req.params.postId});
        res.status(200).json(allComments)
    } catch (error) {
        res.status(400).json('Error fetching comments')        
    }
})

//delete comment
router.delete("/deletecomment/:id/:userId", async(req,res) => {
    try {
        const comment = await Comments.findById(req.params.id);
        if(comment.userId == req.params.userId){
            await comment.deleteOne();
            res.status(200).json("Comment Deleted")
        }
    } catch (error) {
        res.status(500).json("Error deleting comment")
    }
})

module.exports = router;