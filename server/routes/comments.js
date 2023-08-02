const router = require("express").Router();
const Comment = require("../models/Comment");


// Create a new Comment
router.post("/", async (req, res) => {
    const newComment = new Comment(req.body);
    try {
        const comments = await newComment.save();
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all comments for a specific post
router.get("/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        if (!comments) {
            return res.status(404).json("Comments not fetched");
        }
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json(err);
    }
});


// delete a comment
router.delete("/delete/:commentId", async (req, res) => {

    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json("Comment not found");
        }

        if (comment.userId === req.body.userId) {
            const deletedComment = await comment.deleteOne();
            res.status(200).json(deletedComment);
        }
        else {
            res.status(403).json("You can delete only your post's comments")
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;