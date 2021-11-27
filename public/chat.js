const chatForm = document.getElementById('chat-form');
const socket = io();

const chatMessages  = document.querySelector('.chat-messages');
//Get userName and room from URL
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const {course } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

var username = "";

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
    username = json[0].name;
    return json[0].name;
}
async function initialize(){
    username = await getName();
    socket.emit('joinRoom', {username, room});
}

//Message from server.
socket.on('Message', message => {
    outputMessage(message);


    chatMessages.scrollTop = chatMessages.scrollHeight;


});

chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const message = e.target.elements.msg.value;


    socket.emit('chatMessage', message);

    e.target.elements.msg.value = ''; 
    e.target.elements.msg.focus();

})

//Output Message to DOM
async function outputMessage(message){

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