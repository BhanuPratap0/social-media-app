const router = require("express").Router();
const Conversation = require('../models/Conversation')


//New conv
router.post("/", async(req, res) =>{
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation)
    } catch (error) {
        res.status(500).json(error);
    }
})


//get conv of a user

router.get("/:userId", async(req, res)=>{
    try {
        const conversation = await Conversation.find({
            members :{ $in: [req.params.userId] },
        });
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error);
    }
})

//delete a conversation

router.delete("/delete/:id", async(req,res) => {
    try {
        await Conversation.findByIdAndDelete(req.params.id);
        res.status(200).json("Conversation Deleted")
    } catch (error) {
        res.status(500).json(error);
    }
})
module.exports = router;

