const router = require("express").Router();
const Message = require("../models/Message");

// send a message
router.post("/", async (req, res) => {
    const newMessage = new Message(req.body);

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage)
    } catch (err) {
        res.status(500).json(err)
    }
})

// get a conversation
router.get("/:conversationId", async (req, res) => {

    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err)
    }
})

// get the last message of a conversation
router.get("/last/:conversationId", async (req, res) => {

    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        })
            .sort({ createdAt: -1 }) // Sorting messages by createdAt in descending order
            .limit(1); // Limit the results to the last 1 message

        res.status(200).json(messages)
    } catch (err) {
        res.status(500).json(err)
    }
})

// delete a message
router.delete("/:messageId", async (req, res) => {
    const message = await Message.findById(req.params.messageId)
    !message && res.status(404).json("Can't find the message")

    try {
        const deletedMessage = await message.deleteOne();
        res.status(200).json(deletedMessage)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;