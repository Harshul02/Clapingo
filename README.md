# Clapingo-REST-API
A REST API where student can log in, add a teacher to their favorite list, remove the teacher from their favorite list.

### Technologies Used
node.js, express.js, mongoose & MongoDB

### How To Use This API?
<hr/>

- To login a student

```
app.route("/students/login")
.post()
```

- To get details of all Students

```
app.route("/students")
.get()
```

- To add new student.
```
app.route("/students")
.post()
```
It accepts two parameters, student name as **studName** and teacher id as **teaId**. It also require a token which is generated at the time of login and that token is used to add data using post request.

- To get details of all Teachers

```
app.route("/teachers")
.get()
```

- To add new Teacher
```
app.route("/teachers")
.post()
```
It accepts three parameters,Teacher Id as **tid**, Teacher name as **name**,Teacher's subject as **subject**.

- To delete teacher from student's favourite list
```
app.route("/students/deleteFavourite")
.delete()
```
It accepts two parameters, student name as **studName** who wants to delete and teacher id as **teaId** of that teacher, student wants to delete. 

- To find the Favourite Teacher
```
app.route("/teachers/favouriteTeacher")
.get()
```
