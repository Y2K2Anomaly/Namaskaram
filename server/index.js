const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const commentRoute = require("./routes/comments");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bodyParser = require('body-parser');
const cloudinary = require("cloudinary").v2;


// middlewares
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
});

app.use(bodyParser.json());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
// Middleware to parse JSON data

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(cors({
    origin: "http://localhost:3000"
}));

// middlewares to enable CORS for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


const connectDB = mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

connectDB
    .then(
        () => {
            console.log("Connected to MongoDB")
        })
    .catch(err => console.log(err.message))


// uploading file with multer and cloudinary
app.use(express.urlencoded({ extended: false }))

app.use("/images", express.static(path.join(__dirname, "public/images")))

const storage = multer.diskStorage({

    // filename function to generate a unique name for the file
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);

        // secure_URL or imageURL and public_id of the uploaded image from the Cloudinary response
        const imageUrl = result.secure_url;
        const publicId = result.public_id;

        return res.status(200).json({ imageUrl, publicId });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

app.delete("/api/upload/:public_id", async (req, res) => {
    try {
        const { public_id } = req.params;
        const result = await cloudinary.uploader.destroy(public_id);
        return res.status(200).json({ message: "File deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
});


// routes
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/conversations", conversationRoute)
app.use("/api/messages", messageRoute)
app.use("/api/post/comments", commentRoute)


const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log("backend sever is running! on PORT -", PORT)
})

// Socket
const io = require("socket.io")(server, {
    cors: {
        // origin: "http://localhost:3000",
        origin: "https://namaskaram-client.vercel.app",
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId })
};

const removeUser = (socketId) => {
    users = users?.filter(user => user.socketId !== socketId)
}

const getUser = (receiverId) => {
    return users?.find(user => user.userId === receiverId)
}

io.on("connection", (socket) => {
    // when connect
    console.log("a user connected.")
    // take userId and socketId from user
    socket.on("addUser", userId => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    });

    // send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });

    // when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!")
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})
