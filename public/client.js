// import { Add } from './Add.js';
function getEmail(){
    

    // console.log(Add(1,2));
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
// document.body.style.backgroundImage = "url('https://picsum.photos/seed/picsum/1366/768')";
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
    let details = document.getElementById("name").innerHTML;
    let seatsAvail = document.getElementById("freeSeats").innerHTML;
    var avail = seatsAvail.split(" ");
    if(Number(avail[2])==0){
        alert("Cannot join in person class. Max Strength has reached.");
        return;
    }
    var res = details.split(" ");
    var courseName = "";
    for(var i = 2; i<res.length; i++){
        courseName+=res[i];
        if(i!=res.length - 1)
            courseName+=" ";
    }


    var data = [{
        courseName: courseName,
        freeSeats: avail[2],
        emailId: emailId
    }];
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
    let details = document.getElementById("name").innerHTML;
    let seatsAvail = document.getElementById("freeSeats").innerHTML;
    var avail = seatsAvail.split(" ");
    var res = details.split(" ");
    var courseName = "";
    for(var i = 2; i<res.length; i++){
        courseName+=res[i];
        if(i!=res.length - 1)
            courseName+=" ";
    }


    var data = [{
        courseName: courseName,
        freeSeats: avail[2],
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
async function sendCourse() {
    
    const courses = await getCourses();


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
function onSignIn(googleUser){

    const signIn = document.getElementById('signIn');
    signIn.classList.add('hidden');
    const signOut = document.getElementById('signOut');
    signOut.classList.remove('hidden');
    const functionality = document.getElementById('functionality');
    functionality.classList.remove('hidden');
    const showName = document.getElementById('showName');
    showName.classList.remove('hidden');
    var auth2 = gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
        var profile = auth2.currentUser.get().getBasicProfile();
        showName.innerHTML = "Hello, " + profile.getName() + ".";
    }

}
async function getName(){
    var auth2 = gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
        var profile = auth2.currentUser.get().getBasicProfile();
        return profile.getName();    
    }
}
function signOut(){

    // console.log(Add(1,2));

    gapi.auth2.getAuthInstance().signOut().then(function(){
    })

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
    sendCourse();

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
    // console.log( name);
    // console.log(data[0].name);
    const response = await fetch ('/sendName', options);
    const json = await response.json();
    

}