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
const bodyParser = require('body-parser');
const cloudinary = require("cloudinary").v2;


// middlewares
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
});

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
// Middleware to parse JSON data
app.use(bodyParser.json());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(cors({
    origin: "http://localhost:3000"
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


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("backend sever is running! on PORT -", PORT)
})