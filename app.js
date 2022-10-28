const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

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


function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}

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
.post(verifyToken ,function(req,res){
    jwt.verify(req.token, 'secretkey', function(err,authData){
        if(err)
        {
            res.sendStatus(403);
        }
        else{
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
                    Teacher.updateOne({tid: id},{$inc: {count: 1}}, function(err){
                        if(!err){
                            console.log("successfully increased count by 1 from found");
                        }
                        else{
                            console.log(err);
                        }
                    });
                    res.send("Successfully updated data");
                }
                else{
                    const stud = new Student({
                        name: name1,
                        favourite_teacher: []
                    });
                    stud.favourite_teacher.push(id);
                    stud.save(function(err){
                        if(!err){
                            res.send("Successfully Added new student");
                        }
                        else{
                            res.send(err);
                        }
                    });
                    Teacher.updateOne({tid: id},{$inc: {count: 1}}, function(err){
                        if(!err){
                            console.log("successfully increased count by 1 from new Record");
                        }
                        else{
                            console.log(err);
                        }
                    });
                }
            }
            else{
                res.send(err);
            }
        })
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
});

app.route("/students/deleteFavourite")
.delete(function(req,res){
    const name1 = req.body.studName;
    const id = req.body.teaId;

    Student.findOneAndUpdate({name: name1},{$pull: {favourite_teacher: id}}, function(err,foundData){
        if(!err)
        {
            Teacher.updateOne({tid: id},{$inc: {count: -1}}, function(err){
                if(!err){
                    console.log("successfully decreased count by 1");
                }
                else{
                    console.log(err);
                }
            });
            res.send("Successfully Deleted");
        }
        else{
            res.send(err);
        }
    });
});

app.route("/teachers/favouriteTeacher")
.get(function(req,res){
    Teacher.find({},function(err, foundTeacher)
    {
        if(!err)
        {
            res.send(foundTeacher);
        }
        else{
            res.send(err);
        }
    }).sort({count : -1}).limit(1);
})

app.route("/students/login")
.post(function(req,res){
    const user ={
        id: 1,
        username: 'Bro',
        email: 'bro@gmail.com'
    }
    jwt.sign({user}, 'secretkey', function(err,token){
        res.json({token});
    })
})


app.listen(3000, function() {console.log("Server is running on port 3000")});