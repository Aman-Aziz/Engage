const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');
const { isObject } = require('util');

const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const { EWOULDBLOCK } = require('constants');


const app = express();
const server = http.createServer(app);
var port = process.env.PORT || 8000;
const io = socketio(server);
app.use(express.static('public'));
app.use(express.json({limit: '1000mb'}));
app.post('./server.js')

//Run when a client connects
io.on('connection', socket => {
    var name = "Live Discussion Room BOT";

    socket.on('joinRoom', ({username, room})=>{
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        //Welcome current user. To the connecting client only
        socket.emit('Message', formatMessage(name, 'Welcome to Live Discussion Room') );

        //Broadcast when a user connects. To everyone except the connecting client
        socket.broadcast.to(user.room).emit('Message', formatMessage(name, `${user.username} has joined this live discussion room`));
        
        //Send users and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
});

    //Listen for chat message
    socket.on('chatMessage', (msg) =>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('Message', formatMessage(user.username, msg));
    })

    //Run when client disconnects
    socket.on('disconnect', () =>{  
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('Message', formatMessage(name, `${user.username} has left this live discussion room`));
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});


const courseSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        },
        courseCode: {
            type: String,
        },
        instructorInCharge: {
        type: String,
        },
        emailInstructor: {
            type: String,
        },
        maxSeats: {
            type: Number,
        },
        freeSeats: {
            type: Number,    
        },
    },
)

const studentSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        },
        instituteID: {
            type: String,
        },
        emailID: {
        type: String,
        },
        courses: {
            type: Array,
        },
    },
)
 
var studentName;
app.post('/sendName', (request, response) =>{
    studentName = request.body[0].name;
    response.send(JSON.stringify(studentName));
})
app.post('/getNameOfUser', (request, response)=>{
    const data =[
        {
            name:studentName
        }
    ]
    response.send((data));
})

app.post('/verifyAdmin', (request, response)=>{
    var uname = request.body[0].uname;
    var pword = request.body[0].pword;
    var res = "NOT OK";
    if(uname=="admin" && pword=="admin"){
        res = "OK";
    }
    response.send(JSON.stringify(res));
})

app.post('/getCurrentRegistration', (request, response)=>{
    let emailId = request.body[0].emailId;
    let courseName = request.body[0].courseName;
    const studentModel = mongoose.model('studentSchema', studentSchema);
    studentModel.find({emailID : emailId}, function(err, docs){
        if(!err){
            var ans;
            for(var key in docs[0].courses){
                if(courseName==docs[0].courses[key].name){
                    ans = docs[0].courses[key].pref;
                    break;
                }
            }
            response.send(JSON.stringify(ans));
        }
    })
})

app.post('/getCourseList',  (request, response) =>{
    const doc =[];
    const studentModel = mongoose.model('studentSchema', studentSchema);
    studentModel.find({emailID: request.body[0].emailId},  function(err, docs) {
        if (!err) {
                for(var key in docs[0].courses){
                    doc.push(docs[0].courses[key].name);
                }
            response.send(JSON.stringify(doc));
        }
        else {
            throw err;
            response.send(JSON.stringify("Error Occured"));
        }
    });

});


app.post('/getCourseDetails', (request, response) =>{

    const courseModel = mongoose.model('courseSchema', courseSchema)
    let courseName = request.body[0].courseName;
    courseModel.find({name: courseName},  function(err, docs){
        if(!err){
            response.send(JSON.stringify(docs));
        }
    });

})
app.post('/updateStudent', (req, res)=>{
    const studentModel = mongoose.model('studentSchema', studentSchema);
    studentModel.findOneAndUpdate({emailID: req.body[0].emailId},{courses: req.body[0].newArr}, {new: true}, (error, data)=>{
        if(error) 
            console.log(error);
        else
            res.send(JSON.stringify("Done Updating"));
    });
})

app.post('/registerForOnline', (request, response)=>{
    let courseName = request.body[0].courseName;
    let freeSeats = request.body[0].freeSeats;
    freeSeats = Number(freeSeats) + 1
    let emailId = request.body[0].emailId;
    const studentModel = mongoose.model('studentSchema', studentSchema);
    let newArr = [];

    studentModel.find({emailID: emailId}, function(err, docs){
        for(var key in docs[0].courses){
            newArr.push(docs[0].courses[key]);
        }
        var objIndex = newArr.findIndex((obj => obj.name == courseName));
        if(newArr[objIndex].pref==false){
            response.send(JSON.stringify("Already registered for online mode"));
            return;
        }
        newArr[objIndex].pref = false;
        const courseModel = mongoose.model('courseSchema', courseSchema)
        courseModel.findOneAndUpdate({name: courseName}, {freeSeats: freeSeats}, {new: true}, (error, data)=>{
            if(error) 
                console.log(error);
            else
                response.send(JSON.stringify(newArr));
        });
    })
})

app.post('/registerForInPerson', (request, response) =>{


    let courseName = request.body[0].courseName;
    let freeSeats = request.body[0].freeSeats;
    freeSeats = Number(freeSeats) - 1
    let emailId = request.body[0].emailId;

    const studentModel = mongoose.model('studentSchema', studentSchema);
    let newArr = [];

    studentModel.find({emailID: emailId}, function(err, docs){
        for(var key in docs[0].courses){
            newArr.push(docs[0].courses[key]);
        }
        var objIndex = newArr.findIndex((obj => obj.name == courseName));
        if(newArr[objIndex].pref==true){
            response.send(JSON.stringify("Already registered for in-person"));
            return;
        }
        newArr[objIndex].pref = true;
        const courseModel = mongoose.model('courseSchema', courseSchema)
        courseModel.findOneAndUpdate({name: courseName}, {freeSeats: freeSeats}, {new: true}, (error, data)=>{
            if(error) 
                console.log(error);
            else
                response.send(JSON.stringify(newArr));
        });
    })
})

app.post('/getCourseList2',  (request, response) =>{
    const doc =[];
    const courseModel = mongoose.model('courseSchema', courseSchema);
    courseModel.find({}, function(err, docs){
        if(!err){
            for (var i=0; i<docs.length; i++){
                doc.push(docs[i].name);
            }
            response.send(doc);
        }
    })
    
});

function updateDB(data){
    const studentModel = mongoose.model('studentSchema', studentSchema);
    arr = [];
    const map = new Map();
    for (var i=0; i<data.courses.length; i++){
        if(!map.has(data.courses[i])){
            map[data.courses[i]] = false;
            var obj = {
                name: data.courses[i],
                pref: false
            };
            arr.push(obj);
        }
        
    }

   
    let newUser = {
        name: data.name,
        instituteID: data.instituteID,
        emailID: data.emailID,
        courses: arr
    }

    return studentModel.create(newUser);
}
app.post('/checkIfStudentExists',  (request, response) =>{
    var name = request.body[0].name;
    var instituteID = request.body[0].instituteID;
    var emailID = request.body[0].emailID;
    const studentModel = mongoose.model('studentSchema', studentSchema);
    studentModel.countDocuments({emailID: emailID, name: name, instituteID: instituteID}, function(err, count){
        if(count==0){
            response.send(JSON.stringify("OK"));
            updateDB(request.body[0]);
        }
        else{
            response.send(JSON.stringify("NOT OK"))
        }
    });
    
    
    
});

console.log("Starting Server ...")
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.raaoz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  )
  .then((result) => {
    server.listen(port, ()=>{
        console.log("Server Started")
    });
    
  })
  .catch((err) => {
    console.log(err);
  });