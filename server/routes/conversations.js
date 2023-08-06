const router = require("express").Router();
const Conversation = require("../models/Conversation");

// get all conversations
router.get("/all", async (req, res) => {

    try {
        const allConversations = await Conversation.find({})
        res.status(200).json(allConversations)
    } catch (err) {
        console.log(err)
    }
})

// new conversation
router.post("/", async (req, res) => {
    console.log(req.body)
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    });

    try {
        const savedConversation = await newConversation.save()
        res.status(200).json(savedConversation)
    } catch (err) {
        res.status(500).json(err)
    }
});

// get all conversations of a user
router.get("/:userId", async (req, res) => {

    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        })
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err)
    }
});

// get a conversation includes two userId
router.get('/find/:firstUserId/:secondUserId', async (req, res) => {
    console.log(req.params.firstUserId)
    console.log(req.params.secondUserId)
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] }
        });
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err)
    }
})

// delete a conversation
router.delete("/delete/:conversationId", async (req, res) => {
    const conversation = await Conversation.findById(req.params.conversationId)
    !conversation && res.status(404).json("Conversation not Found!")

    try {
        await conversation.deleteOne()
        res.status(200).json("Conversation deleted Successfully")
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;