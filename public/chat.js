const chatForm = document.getElementById('chat-form');
const socket = io();

const chatMessages  = document.querySelector('.chat-messages');
//Get userName and room from URL
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const {course } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
// console.log(course);
//Join chatroom
var username = "";

//Get room and users
initialize();
var room = course;
socket.on('roomUsers', ({room, users})=>{
    outputRoomName(room);
    outputUsers(users);

});





async function getName(){
    const data = [
        {
            name: "Student Name"
        }
    ];
    const options = {
        method: 'POST',
        body : JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch('/getNameOfUser', options);
    const json = await response.json();
    // console.log(json[0].name + " is the name");
    username = json[0].name;
    // console.log("This is the username client side " + username);
    return json[0].name;
}
async function initialize(){
    username = await getName();
    // console.log("Got this name " + username);
    socket.emit('joinRoom', {username, room});
}
// var studentName = console.log(getName() + " is the name");

//Message from server.
socket.on('Message', message => {
    // initialize();
    // console.log(message);
    outputMessage(message);


    //Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;


});

chatForm.addEventListener('submit', (e) =>{
    // initialize();
    e.preventDefault();

    //Get message Text
    const message = e.target.elements.msg.value;

    //console.log(message);

    //Emitting a message to the server.
    socket.emit('chatMessage', message);

    //Clear input
    e.target.elements.msg.value = ''; 
    e.target.elements.msg.focus();

})

//Output Message to DOM
async function outputMessage(message){
    // initialize();

    var studentName = await getName();
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.userName/*await getName()*/ + " "}<span> ${message.time}</span></p>
    <p class="text">
        ${message.textMessage}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
    
}

//Add Room Name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//Add Users to DOM
function outputUsers(users){
    userList.innerText = "";
    users.forEach((students)=>{
        let li = document.createElement("li");
        li.innerText = students.username;
        userList.appendChild(li);
    })
  
}