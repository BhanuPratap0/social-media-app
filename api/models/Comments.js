const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    postId: {
        type: String,
        require: true
    },
    desc: {
        type: String,
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Comments", CommentsSchema);