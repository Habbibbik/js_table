const SERVER_URL = 'http://localhost:3000'


 async function serverAddStudent(obj) {
 let respons = await fetch(SERVER_URL + '/api/students', {
    method: "POST",
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(obj),
 })

 let data = await respons.json()

 return data
}


async function serverGetStudent() {
  let respons = await fetch(SERVER_URL + '/api/students/', {
     method: "GET",
     headers: { 'Content-Type': 'application/json'}
  })

  let data = await respons.json()

  return data
 }

 async function serverDeleteStudent(id) {
  let respons = await fetch(SERVER_URL + '/api/students/'+ id, {
     method: "DELETE",
  })

  let data = await respons.json()

  return data
 }

let serverData = await serverGetStudent()

let listStudents = [

]

if(serverData){
  listStudents = serverData
}

function formatDate(date) {

  var dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  var mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  var yy = date.getFullYear();
  if (yy < 10) yy = '0' + yy;

  return dd + '.' + mm + '.' + yy;
}

function $getNewStudentTR(studObj){
    const $tr = document.createElement("tr")
    const $tdFIO = document.createElement("td")
    const $tdBirtday = document.createElement("td")
    const $tdFaculty = document.createElement("td")
    const $tdstudyStart = document.createElement("td")
    const $tdDelete = document.createElement("td")
    const $btnDelete = document.createElement("button")

    $btnDelete.classList.add("btn", "btn-danger")
    $btnDelete.textContent = "Удалить"

    $tdFIO.textContent = `${studObj.surname} ${studObj.name} ${studObj.lastname}`
    $tdBirtday.textContent = formatDate(new Date(studObj.birthday))
    $tdFaculty.textContent = studObj.faculty
    $tdstudyStart.textContent = studObj.studyStart

    $btnDelete.addEventListener("click", async function() {
      await serverDeleteStudent(studObj.id)
      $tr.remove()
    })

    $tdDelete.append($btnDelete)
    $tr.append($tdFIO,$tdBirtday,$tdFaculty,$tdstudyStart, $tdDelete)
    return $tr
}


function render(arr){
  let copyArr = [...arr]


  const $studTable = document.getElementById("stud-table")

  $studTable.innerHTML = ''
  for (const studObj of copyArr) {

    const $newTr = $getNewStudentTR(studObj)

    $studTable.append($newTr)
  }
}
render(listStudents)

document.getElementById("add-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  // Get and trim values
  let name = document.getElementById("name-inp").value.trim();
  let surname = document.getElementById("surname-inp").value.trim();
  let lastname = document.getElementById("lastname-inp").value.trim();
  let birthday = document.getElementById("burthday-inp").value;
  let faculty = document.getElementById("faculty-inp").value.trim();
  let studyStart = document.getElementById("studyStart-inp").value.trim();

  // Current date for validation
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  // Validate fields
  if (!name || !surname || !lastname || !birthday || !faculty || !studyStart) {
    alert("Все поля обязательны для заполнения.");
    return;
  }

  // Validate date of birth
  let birthdayDate = new Date(birthday);
  if (birthdayDate < new Date("1900-01-01") || birthdayDate > currentDate) {
    alert("Дата рождения должна быть в диапазоне от 01.01.1900 до текущей даты.");
    return;
  }

  // Validate study start year
  let studyStartYear = parseInt(studyStart, 10);
  if (isNaN(studyStartYear) || studyStartYear < 2000 || studyStartYear > currentYear) {
    alert("Год начала обучения должен быть в диапазоне от 2000-го до текущего года.");
    return;
  }

  let newStudentObj = {
    name: name,
    surname: surname,
    lastname: lastname,
    birthday: birthdayDate,
    studyStart: studyStartYear,
    faculty: faculty,
  };

  let serverDataObj = await serverAddStudent(newStudentObj);
  serverDataObj.birthDate = new Date(serverDataObj.birthDate);

  listStudents.push(serverDataObj);
  render(listStudents);
});

