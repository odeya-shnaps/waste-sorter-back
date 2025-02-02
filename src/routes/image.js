//const express = require("express");
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("getting image");
});

// get all images

//get image by id?

//delete image with id

router.get("/:id", (req, res) => {
  res.send(`The image id is: ${req.params.id}`);
});

export default router;
