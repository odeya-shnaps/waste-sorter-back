import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { Database } from "./database.js";
dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const newFileName = Date.now() + path.extname(file.originalname);
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });
const app = express();
const PORT = process.env.PORT || 3000;
const results = ["glass", "paper", "cardboard", "plastic", "metal", "trash"];

function getResult() {
  const randomNum = Math.floor(Math.random() * 6);
  return results[randomNum];
}

const db = new Database();
db.connect();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

app.get("/history", async (req, res) => {
  try {
    const history = await db.getAllImages();
    res.status(200).send(history);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something broke while getting the history.");
  }
});

app.get("/image/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const image = await db.getImage(id);
    // image not found on db
    if (!image) {
      res.status(404).send(`Image ${id} Not Found.`);
      //res.status(200).send({});
    }
    res.status(200).send(image);
  } catch (err) {
    console.log(err);
    res.status(500).send(`Something broke while getting image ${id}.`);
  }
});

app.post("/upload", upload.array("image"), async (req, res) => {
  try {
    // Access the uploaded files
    const uploadedFiles = req.files; // Array of files (use req.file for single file upload)
    const result = getResult();
    const uploadedImage = {
      imageName: uploadedFiles[0].filename,
      originalName: uploadedFiles[0].originalname,
      result: result,
      url: "http://fakeurl/image.jpg",
    };
    // add image to db
    const newImage = await db.insertImage(uploadedImage);
    res
      .status(201)
      .send({ success: true, message: { result }, data: { newImage } });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send(`Something broke while uploading image and getting result`);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down server...");
  try {
    await db.closeConnection(); // Call the cleanup method
    console.log("Server and database connections closed.");
  } catch (error) {
    console.error("Error during shutdown:", error);
  }
  process.exit();
});

//const imageRouter = require("./routes/image");
//app.use("/image", imageRouter);
/*
    // Extract new and original file names
    const fileDetails = uploadedFiles.map((file) => ({
      imageName: file.filename,
      originalName: file.originalname,
      result: result,
      url: "http://fakeurl/image.jpg",
    }));


    console.log("Uploaded Files:", fileDetails);

    // Example: Send the details back as a response
    res.status(200).json({
      message: "Files uploaded successfully",
      files: fileDetails,
    });
*/
