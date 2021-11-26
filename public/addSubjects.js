var x = 0;
const {name, instituteID, emailID } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
async function getCourses(){
    const data = [
        {
            courses: [],
        }
    ];
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    }
    const response = await fetch('/getCourseList2', options);
    const courses = await response.json();
    return courses;
}

async function GenerateDropdown() {

    var values = ["dog", "cat", "parrot", "rabbit"];
  
    var select = document.createElement("select");
    select.name = "courses";
    select.id = "courses" + String(x);
    x+=1;


    values = await getCourses(); 

    for (const val of values) {
      var option = document.createElement("option");
      option.value = val;
      option.text = val.charAt(0).toUpperCase() + val.slice(1);
      select.appendChild(option);
    }
  
    var label = document.createElement("label");
    label.innerHTML = "Choose Course: "
    label.htmlFor = "courses";  
  
    document.getElementById("container").appendChild(label).appendChild(select);
    linebreak = document.createElement("br");
    document.getElementById("container").appendChild(linebreak);


  }
async function updateDB(data){
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json'
        }
    }

    const response = await fetch('/addStudentToDatabase', options);
    const json = await response.json();
    return json;
}
async function SubmitCourses(){
        var courses = [];
        for (var i = 0; i <x; i++){
            var id = "courses" + String(i);
            courses.push(document.getElementById(id).value);
        }

        const data =[
            {
                name: name,
                instituteID: instituteID,
                emailID: emailID,
                courses: courses
            }
        ];
    
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json'
            }
        }
        const response = await fetch('/checkIfStudentExists', options);
        const json = await response.json();

       x = 0;
  }