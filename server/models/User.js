const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true
        },
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 6
        },
        profilePicture: {
            url: {
                type: String,
                default: ""
            },
            public_id: {
                type: String,
                default: ""
            }
        },
        coverPicture: {
            url: {
                type: String,
                default: ""
            },
            public_id: {
                type: String,
                default: ""
            }
        },
        followers: {
            type: Array,
            default: []
        },
        followings: {
            type: Array,
            default: []
        },
        desc: {
            type: String,
            max: 50
        },
        city: {
            type: String,
            max: 50
        },
        from: {
            type: String,
            max: 50
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        relationship: {
            type: Number,
            enum: [1, 2, 3]
        },
    },
    { timestamps: true }
)


module.exports = mongoose.model("User", UserSchema);