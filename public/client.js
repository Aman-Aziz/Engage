
function getEmail(){
    var auth2 = gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
        var profile = auth2.currentUser.get().getBasicProfile();
        return(profile.getEmail());
    }
}
async function getCurrentRegistration(courseNameSelected){
    let emailId = getEmail();
    const data = [{
        courseName: courseNameSelected,
        emailId: emailId
    }];
    const options =  {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response1 = await fetch('/getCurrentRegistration', options);
    const json1 = await response1.json();
    return json1;
}
var nameOfCourse = "";
var seatsAvail = 0;

async function getCourseDetails(courseNameSelected){ 
    const functionalityButton = document.getElementById('functionalityButton');
    functionalityButton.classList.add('hidden');
    document.getElementById("details").innerHTML = "";
    var data = [{
        courseName: courseNameSelected
    }];
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch('/getCourseDetails', options);
    const json = await response.json();

    const currentRegistration = await getCurrentRegistration(courseNameSelected);
    
    let list = document.getElementById("details");
    let li = document.createElement("li");
    li.innerText = "Course Name: " + json[0].name;
    li.id = "name";
    list.appendChild(li);
    //console.log(li.innerText);
    nameOfCourse = json[0].name;

    li = document.createElement("li");
    li.innerText = "Course Code: " + json[0].courseCode;
    li.id = "courseCode"
    list.appendChild(li);
    
    li = document.createElement("li");
    li.innerText = "Instructor in-charge: " + json[0].instructorInCharge;
    li.id = "instructorInCharge";
    list.appendChild(li);
    
    li = document.createElement("li");
    li.innerText = "Maximum Seats: " + json[0].maxSeats;
    li.id = "maxSeats";
    list.appendChild(li);
    
    li = document.createElement("li");
    li.innerText = "Seats Available: " + json[0].freeSeats;
    li.id = "freeSeats";
    list.appendChild(li);   
    seatsAvail = json[0].freeSeats;
    
    li = document.createElement("li");
    li.innerText = "Currently Registered for: ";
    if(currentRegistration)
        li.innerText+= "Offline/In-person class";
    else
        li.innerText+= "Online Model";
    li.id = "currentRegistration";
    list.appendChild(li);



}

async function inPersonClass(){
    let emailId = getEmail();
    if(Number(seatsAvail)==0){
        alert("Cannot join in person class. Max Strength has reached.");
        return;
    }
    var courseName = nameOfCourse

    console.log("This is the course Name: " + courseName);
    var data = [{
        courseName: courseName,
        freeSeats: seatsAvail,
        emailId: emailId
    }];
    console.log(data);
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch('/registerForInPerson', options);
    const json = await response.json();
    const reload = await getCourseDetails(courseName);
    if(json=="Already registered for in-person"){
        alert("Already registered for Offline/In-person mode of class");
        return;
    }
    else{
        data = [{
            emailId: emailId,
            newArr: json
        }]
        options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response2 = await fetch('/updateStudent', options);
        const json2 = await response2.json();
        const functionalityButton = document.getElementById('functionalityButton');
        functionalityButton.classList.add('hidden');
        document.getElementById("details").innerHTML = "";
        const reload = await getCourseDetails(courseName);
    }

}

async function onlineClass(){
    let emailId = getEmail();
 
    var courseName = nameOfCourse;
    var data = [{
        courseName: courseName,
        freeSeats: seatsAvail,
        emailId: emailId
    }];
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch('/registerForOnline', options);
    const json = await response.json();
    const reload = await getCourseDetails(courseName);    
    if(json=="Already registered for online mode"){
        alert("Already registered for online mode of class");
        return;
    }
    else{
        data = [{
            emailId: emailId,
            newArr: json,
        }]
        options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response2 = await fetch('/updateStudent', options);
        const json2 = await response2.json();
        const functionalityButton = document.getElementById('functionalityButton');
        functionalityButton.classList.add('hidden');
        document.getElementById("details").innerHTML = "";
        const reload = await getCourseDetails(courseName);

    }
}
async function getCourses(){
    var emailId = getEmail();
    const data = [
        {
            emailId: emailId
        }
    ]
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    }

    const response = await fetch('/getCourseList', options);
    const courses = await response.json();
    return courses;
}
async function goBackForFaculty(){
    document.getElementById('functionalityButton2').classList.add('hidden');
     document.getElementById('CoursesForFaculty').classList.remove('hidden');
    document.getElementById('particularCourse2').classList.add('hidden');
    faculty();
}
async function facultyCourseDetails(){
    document.getElementById('functionalityButton2').classList.remove('hidden');
    var courseName = document.getElementById('coursesFaculty').value;
    // console.log(courseName.value);

    document.getElementById('ChatRoomsForFaculty').classList.add('hidden');
    document.getElementById('CoursesForFaculty').classList.add('hidden');
    document.getElementById('particularCourse2').classList.remove('hidden');

    document.getElementById('details2').innerHTML = "";
    var data =[
        {
            courseName: courseName
        }
    ];
    //console.log(data);
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    var response = await fetch('/getCourseDetails', options);
    var json = await response.json();
    //console.log(json);

    let list = document.getElementById("details2");
    let li = document.createElement("li");
    li.innerText = "Course Name: " + json[0].name;
    li.id = "name";
    list.appendChild(li);
   

    li = document.createElement("li");
    li.innerText = "Course Code: " + json[0].courseCode;
    li.id = "courseCode"
    list.appendChild(li);
    
    li = document.createElement("li");
    li.innerText = "Instructor in-charge: " + json[0].instructorInCharge;
    li.id = "instructorInCharge";
    list.appendChild(li);
    
    li = document.createElement("li");
    li.innerText = "Maximum Seats: " + json[0].maxSeats;
    li.id = "maxSeats";
    list.appendChild(li);
    
    li = document.createElement("li");
    li.innerText = "Seats Available: " + json[0].freeSeats;
    li.id = "freeSeats";
    //li.appendChild(document.createElement("br"));
    list.appendChild(li);   
    let li1 = document.createElement("li");
    li1.innerText = "";
    list.appendChild(li1);
    // list = document.getElementById("details3");
    li = document.createElement("li");
    li.innerText = "Students who opted for in-person classes:-";
    li.id = "offline";

    data =[
        {
            courseName: courseName,
            offline: true
        }
    ];
    //console.log(data);
    options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    //console.log(data);
    response = await fetch('/getStudents', options);
    json = await response.json();

    // console.log("Offline")
    // console.log(json);

    if(json.length){
        for(var i = 0; i<json.length; i++) {
            let li2 = document.createElement("li");
            li2.innerText = String(i+1) + ". " +json[i].name + " - " + json[i].instituteID;
            li.appendChild(li2);
        }
    }
    else{
        let li2 = document.createElement("li");
        li2.innerText = "NONE";
        li.appendChild(li2);
    }

    list.appendChild(li);
    let li2 = document.createElement("li");
    li2.innerText = "";
    list.appendChild(li2);

    li = document.createElement("li");
    li.innerText = "Students who opted for online classes:-";
    li.id = "online";
    

    data =[
        {
            courseName: courseName,
            offline: false
        }
    ];
    //console.log(data);
    options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    //console.log(data);
    response = await fetch('/getStudents', options);
    json = await response.json();

    // console.log("Online")
    // console.log(json);

    if(json.length){
        for(var i = 0; i<json.length; i++) {
            let li2 = document.createElement("li");
            li2.innerText = String(i+1) + ". " +json[i].name + " - " + json[i].instituteID;
            li.appendChild(li2);
        }
    }
    else{
        let li2 = document.createElement("li");
        li2.innerText = "NONE";
        li.appendChild(li2);
    }

    list.appendChild(li);



}

async function sendCourse(isFaculty) {
    var courses;
    
    courses = await getCourses();

    let list = document.getElementById("myList");
    list.innerHTML = "";
    courses.forEach((item) => {
        let li = document.createElement("li");
        let anchor = document.createElement("a");
        anchor.href = "#";
        anchor.id = item;
        anchor.innerText = item;
        li.appendChild(anchor);
        list.appendChild(li);
    });

    $(function(){
        $('a').click(function(){
            var courseNameSelected = "";
            courseNameSelected = $(this).attr('id');
            if(courseNameSelected!='Courses'){
                const hideList = document.getElementById('allCourses');
                hideList.classList.add('course--hidden');
                const showDetails = document.getElementById('particularCourse');
                showDetails.classList.remove('course--hidden');
                getCourseDetails(courseNameSelected);
            }
        });
        

        
    });



    
}
async function faculty(){
   
    // const functionalityButton = document.getElementById('functionalityButton');
    // functionalityButton.classList.remove('hidden');
    const CoursesForFaculty = document.getElementById('CoursesForFaculty');
    CoursesForFaculty.classList.remove('hidden');
    document.getElementById('ChatRoomsForFaculty').classList.remove('hidden');
    console.log(document.getElementById('ChatRoomsForFaculty').classList);
    // const particularCourse = document.getElementById('particularCourse');
    // particularCourse.classList.remove('hidden');
    var emailId = getEmail();
    const data = [
        {
            
        }
    ]
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    }

    const response = await fetch('/getCourseList2', options);
    const courses = await response.json();
    //console.log("this is the list");
    //console.log(courses);



    let form = document.getElementById('coursesFaculty');
    form.innerHTML = "";
    
    courses.forEach((item) =>{
        let opt = document.createElement('option');
        opt.value = item;
        opt.innerText = item;
        opt.classList.add('classList');
        form.appendChild(opt);
    })


}
async function onSignIn(googleUser){
    var emailID = getEmail();
    const data = [
        {
            emailID: emailID
        }
    ]
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    }

    const response = await fetch('/checkIfTeacher', options);
    const json = await response.json();
    
    const register = document.getElementById('register');
    register.classList.add('hidden');
    const signIn = document.getElementById('signIn');
    signIn.classList.add('hidden');
    const signOut = document.getElementById('signOut');
    signOut.classList.remove('hidden');

    const showName = document.getElementById('showName');
    showName.classList.remove('hidden');
    var auth2 = gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
        var profile = auth2.currentUser.get().getBasicProfile();
        showName.innerHTML = "Hello, " + profile.getName() + ".";
    }

    if(json){
        const fac = await faculty();
    }
    else{
        const functionality = document.getElementById('functionality');
        functionality.classList.remove('hidden');
    }





}
async function getName(){
    var auth2 = gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
        var profile = auth2.currentUser.get().getBasicProfile();
        return profile.getName();    
    }
}
function Register(){
    const register = document.getElementById('register');
    register.classList.add('hidden');
    const signIn = document.getElementById('signIn');
    signIn.classList.add('hidden');
    const adminVerification = document.getElementById('adminVerification');
    adminVerification.classList.remove('hidden');
}
async function AdminVerification(){
    const uname = document.getElementById('uname');
    const pword = document.getElementById('pword');
    

    const data = [
        {
            uname: uname.value,
            pword: pword.value
        }
    ]
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    }


    const response = await fetch('/verifyAdmin', options);
    const json = await response.json();

    if(json=="OK"){
        const adminVerification = document.getElementById('adminVerification');
        adminVerification.classList.add('hidden');
        const userEntry = document.getElementById('userEntry');
        userEntry.classList.remove('hidden');

    }
    else{
        alert("Wrong Username-Password combinatin");
    }


}


function signOut(){


    gapi.auth2.getAuthInstance().signOut().then(function(){
    })
    const register = document.getElementById('register');
    register.classList.remove('hidden');
    const signIn = document.getElementById('signIn');
    signIn.classList.remove('hidden');
    const signOut = document.getElementById('signOut');
    signOut.classList.add('hidden');
    const allCourses = document.getElementById('allCourses');
    allCourses.classList.add('hidden');
    const particularCourse = document.getElementById('particularCourse');
    particularCourse.classList.add('hidden');
    const functionality = document.getElementById('functionality');
    functionality.classList.add('hidden');
    const showName = document.getElementById('showName');
    showName.classList.add('hidden');
    const functionalityButton = document.getElementById('functionalityButton');
    functionalityButton.classList.add('hidden');
    const allCoursesOnlineForum = document.getElementById('allCoursesOnlineForum');
    allCoursesOnlineForum.classList.add('hidden');
}

function Scheduler(){
    const functionality = document.getElementById('functionality');
    functionality.classList.add('hidden');
    const functionalityButton = document.getElementById('functionalityButton');
    functionalityButton.classList.remove('hidden');
    const allCourses = document.getElementById('allCourses');
    allCourses.classList.remove('hidden');
    const particularCourse = document.getElementById('particularCourse');
    particularCourse.classList.remove('hidden');
    sendCourse(false);

}

async function goBackToChoosingCourse(){
    document.getElementById("details").innerHTML = "";
    const showList = document.getElementById('allCourses');
    showList.classList.remove('course--hidden');
    const hideDetails = document.getElementById('particularCourse');
    hideDetails.classList.add('course--hidden');
    const functionalityButton = document.getElementById('functionalityButton');
    functionalityButton.classList.remove('hidden');
}

async function goBackToChoosingFunctionality(){
    
    const signIn = document.getElementById('signIn');
    signIn.classList.add('hidden');
    const signOut = document.getElementById('signOut');
    signOut.classList.remove('hidden');
    const functionality = document.getElementById('functionality');
    functionality.classList.remove('hidden');
    const allCourses = document.getElementById('allCourses');
    allCourses.classList.add('hidden');
    const particularCourse = document.getElementById('particularCourse');
    particularCourse.classList.add('hidden');
    const functionalityButton = document.getElementById('functionalityButton');
    functionalityButton.classList.add('hidden'); 
    const allCoursesOnlineForum = document.getElementById('allCoursesOnlineForum');
    allCoursesOnlineForum.classList.add('hidden');
}

async function OnlineForum(){
    const functionality = document.getElementById('functionality');
    functionality.classList.add('hidden');
    const functionalityButton = document.getElementById('functionalityButton');
    functionalityButton.classList.remove('hidden');
    const allCoursesOnlineForum = document.getElementById('allCoursesOnlineForum');
    allCoursesOnlineForum.classList.remove('hidden');


    const courses = await getCourses();
    let form = document.getElementById('course');
    form.innerHTML = "";
    
    courses.forEach((item) =>{
        let opt = document.createElement('option');
        opt.value = item;
        opt.innerText = item;
        opt.classList.add('classList');
        form.appendChild(opt);
    })
    var name = "";
    var auth2 = gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
        var profile = auth2.currentUser.get().getBasicProfile();
        name =  profile.getName();    
    }
    const data = [
        { 
            name: name
        }
    ]
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    }
    const response = await fetch ('/sendName', options);
    const json = await response.json();
    

}