const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/clapingoDB", {useNewUrlParser: true});

const teacherSchema = {
    name: String,
    subject: String
}



app.listen(3000, function() {console.log("Server is running on port 3000")});