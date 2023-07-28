const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// middlewares
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(cors({
    origin: "http://localhost:3000"
    // origin: "https://namaskaram-client.vercel.app"
}));

// routes import
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");


const connectDB = mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true }
)

connectDB
    .then(
        () => {
            console.log("Connected to MongoDB")
        })
    .catch(err => console.log(err.message))


// uploading file multer
app.use(express.urlencoded({ extended: false }))

app.use("/images", express.static(path.join(__dirname, "public/images")))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploaded successfully")
    } catch (err) {
        console.log(err)
    }
})

// routes
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/conversations", conversationRoute)
app.use("/api/messages", messageRoute)


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("backend sever is running! on PORT -", PORT)
})