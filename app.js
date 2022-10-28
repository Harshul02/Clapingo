const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/clapingoDB", {useNewUrlParser: true});

const teacherSchema = {
    tid: Number,
    name: String,
    subject: String,
    count: Number
}

const studentSchema = {
    name: String,
    favourite_teacher: [teacherSchema.tid]
}

const Teacher = mongoose.model("Teacher", teacherSchema);
const Student = mongoose.model("Student", studentSchema);


app.route("/students")
.get(function(req,res){
    Student.find(function(err, foundStudent){
        if(!err){
        res.send(foundStudent);
        }else{
            res.send(err);
        }
    });
})
.post(function(req,res){
    const name1 = req.body.studName;
    const id = req.body.teaId;

    Student.findOne({name: name1}, function(err,foundData)
    {
        if(!err)
        {
            if(foundData)
            {
                foundData.favourite_teacher.push(id);
                foundData.save();
                res.send("Successfully updated data");
            }
            else{
                Student.insertMany({name: name1, favourite_teacher: id}, function(err)
                {
                    if(!err)
                    {
                        res.send("Successfully inserted new Data");
                    }
                    else{
                        res.send(err);
                    }
                });  
            }
        }
        else{
            res.send(err);
        }
    })
});


app.route("/teachers")
.get(function(req,res){
    Teacher.find(function(err, foundTeacher){
        if(!err){
        res.send(foundTeacher);
        }else{
            res.send(err);
        }
    });
})
.post(function(req,res)
{
    const newTeacher = new Teacher({
        name: req.body.name,
        subject: req.body.subject
    });

    newTeacher.save(function(err)
    {
        if(!err){
            res.send("Successfully added a new Teacher.");
        }else{
            res.send(err);
        }
    });
})




app.listen(3000, function() {console.log("Server is running on port 3000")});