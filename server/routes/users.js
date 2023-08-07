const User = require("../models/User");
const router = require('express').Router();
const bcrypt = require('bcrypt');


// get all users 
router.get('/all', async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error while retrieving users', error });
    }
});

// update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            await user.save();
            res.status(200).json("Account has been updated")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can update only your account!")
    }
})

// uploading new profile picture
router.put("/profile/:username", async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user || (user.username !== req.params.username)) {
        return res.status(403).json("You are not authorized to update this profile.");
    }

    try {
        const updateData = req.body.profilePicture?.url
            ? {
                "profilePicture.url": req.body.profilePicture.url,
                "profilePicture.public_id": req.body.profilePicture.public_id,
            }
            : req.body.coverPicture?.url
                ? {
                    "coverPicture.url": req.body.coverPicture.url,
                    "coverPicture.public_id": req.body.coverPicture.public_id,
                }
                : {};

        const updatedUser = await User.findOneAndUpdate(
            { username: req.params.username },
            updateData,
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});



// Remove user's profile picture or cover picture
// DELETE   #Profile_Picture
router.put('/picture/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user || (user.username !== req.params.username)) {
        return res.status(403).json("You are not authorized to update this profile.");
    }

    try {

        const updateData = req.body.profilePicture?.url
            ? {
                "profilePicture.url": "",
                "profilePicture.public_id": "",
            }
            : {};

        await User.findOneAndUpdate(
            { username: req.params.username },
            updateData,
            { new: true }
        );

        res.status(200).json({ message: 'Profile picture deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete profile picture' });
    }
});

// DELETE #Cover_Picture
router.put('/cover/picture/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user || (user.username !== req.params.username)) {
        return res.status(403).json("You are not authorized to update this profile.");
    }

    try {

        const updateData = req.body.coverPicture?.url
            ? {
                "coverPicture.url": "",
                "coverPicture.public_id": "",
            }
            : {};

        await User.findOneAndUpdate(
            { username: req.params.username },
            updateData,
            { new: true }
        );

        res.status(200).json({ message: 'Cover picture deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete cover picture' });
    }
});


// delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted successfully")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can delete only your account!")
    }
})


// get a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    console.log(username)
    try {
        const user = userId
            ? await User.findById(userId).select("-password")
            : await User.findOne({ username: username }).select("-password")
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})

// get friends
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const friends = await Promise.all(
            user.followings.map(friendId => {
                return User.findById(friendId)
            })
        )
        let friendList = [];
        friends.map((friend) => {
            const { _id, name, username, profilePicture } = friend;
            friendList.push({ _id, name, username, profilePicture })
        });
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err)
    }
})

// follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)

            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("user has been followed")
            } else {
                res.status(403).json("you already follow this user")
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you can't follow yourself")
    }
})


// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)

            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("user has been unfollowed")
            } else {
                res.status(403).json("you don't follow this user")
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you can't unfollow yourself")
    }
})



module.exports = router;