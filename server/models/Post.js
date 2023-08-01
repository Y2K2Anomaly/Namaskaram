const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            max: 50,
        },
        img: {
            url: {
                type: String,
                default: ""
            },
            public_id: {
                type: String,
                default: ""
            },
        },
        likes: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
