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
    standard: Number
}

const favouriteSchema = {
    Sname: studentSchema.name,
    Tid: [teacherSchema.tid]
};

const Teacher = mongoose.model("Teacher", teacherSchema);
const Student = mongoose.model("Student", studentSchema);
const Favourite = mongoose.model("Favourite", favouriteSchema);


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
.post(function(req,res)
{
    const newStudent = new Student({
        name: req.body.name,
        standard: req.body.standard
    });

    newStudent.save(function(err)
    {
        if(!err){
            res.send("Successfully added a new Student.");
        }else{
            res.send(err);
        }
    });
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
        id: req.body.id,
        name: req.body.name,
        subject: req.body.subject,
        count: req.body.count
    });

    newTeacher.save(function(err)
    {
        if(!err){
            res.send("Successfully added a new Teacher.");
        }else{
            res.send(err);
        }
    });
});


app.route("/students/favourite")
.get(function(req,res){
    Favourite.find(function(err, foundData){
        if(!err){
        res.send(foundData);
        }else{
            res.send(err);
        }
    });
})
.post(function(req,res){
    const name1 = req.body.studName;
    const id = req.body.teaId;

    Favourite.findOne({Sname: name1}, function(err,foundData)
    {
        if(!err)
        {
            if(foundData)
            {
                foundData.Tid.push(id);
                foundData.save();
                res.send("Successfully updated data");
            }
            else{
                Favourite.insertMany({Sname: name1, Tid: id}, function(err)
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




app.listen(3000, function() {console.log("Server is running on port 3000")});