// Elements
const FormAddExercice = document.querySelector("#form-add-exercice");
const FormAddWorkout = document.querySelector("#form-add-workout");
const ListExercices = document.querySelector("#container-list-exercices ul");
const WorkoutContainer = document.querySelector("#container-workouts");

// $ Functions
const onLoadWindow = () => {
  if (!(localStorage.exercices == null || localStorage.exercices == "")) {
    localStorage.exercices
      .split("/")
      .map((item) => addExercice(JSON.parse(item).id, JSON.parse(item).name));
  }

  if (!(localStorage.workouts == null || localStorage.workouts == "")) {
    localStorage.workouts
      .split("/")
      .map((workout) => addWorkout(JSON.parse(workout)));
  }
};

const saveInLocalStore = (storage, item) => {
  if (localStorage.getItem(storage) == null) {
    localStorage.setItem(storage, item);
  } else {
    localStorage.setItem(storage, localStorage.getItem(storage) + "/" + item);
  }
};

const addExerciceHandler = (e) => {
  e.preventDefault();

  const id = Date.now();

  addExercice(id, e.target.name.value);
  saveExercice(id, e.target.name.value);

  FormAddExercice.reset();
};

const addExercice = (id, text) => {
  if (text != "") {
    const newItem = document.createElement("li");
    newItem.classList.add("draggable");
    newItem.setAttribute("data-id", id);
    newItem.setAttribute("data-exercice", text);
    newItem.setAttribute("draggable", true);
    newItem.innerHTML = `<span class="exercice">${text}</span>`;
    newItem.innerHTML +=
      '<button class="delete-button" data-action="exercice">x</button>';

    ListExercices.appendChild(newItem);
  }

  addEventListeners();
};

const saveExercice = (id, text) => {
  if (text != "") {
    saveInLocalStore("exercices", JSON.stringify({ id: id, name: text }));
  }
};

const addNewWorkoutHandler = (e) => {
  e.preventDefault();

  const id = Date.now();

  addNewWorkout(id, e.target.name.value);
  saveNewWorkout(id, e.target.name.value);

  FormAddWorkout.reset();
};

const addNewWorkout = (id, text) => {
  if (text != "") {
    const newWorkout = document.createElement("div");
    newWorkout.classList.add("container-workout");
    newWorkout.setAttribute("data-id", id);
    newWorkout.innerHTML = `<h2>${text}</h2><ul class="draggable-list"></ul>`;
    newWorkout.innerHTML +=
      '<button class="delete-button" data-action="workout">x</button>';
    WorkoutContainer.appendChild(newWorkout);
  }

  addEventListeners();
};

const saveNewWorkout = (id, text) => {
  if (text != "") {
    saveInLocalStore(
      "workouts",
      JSON.stringify({ id: id, name: text, exercices: [] })
    );
  }
};

const addWorkout = (workout) => {
  const newWorkout = document.createElement("div");
  newWorkout.classList.add("container-workout");
  newWorkout.setAttribute("data-id", workout.id);
  newWorkout.innerHTML = `<h2>${workout.name}</h2>`;
  newWorkout.innerHTML += '<ul class="draggable-list"></ul>';
  newWorkout.innerHTML +=
    '<button class="delete-button" data-action="workout">x</button>';

  WorkoutContainer.appendChild(newWorkout);

  workout.exercices.map((item) => {
    const newItem = document.createElement("li");

    newItem.classList.add("draggable");
    newItem.setAttribute("data-id", item.id);
    newItem.setAttribute("data-exercice", item.name);
    newItem.setAttribute("draggable", true);
    newItem.innerHTML = `<span class="exercice">${item.name}</span>`;
    newItem.innerHTML += `<span class="sets" data-value="sets"><button class="sub">-</button><span class="text">${item.sets}</span><button class="add">+</button></span>`;
    newItem.innerHTML += `<span class="x">x</span>`;
    newItem.innerHTML += `<span class="amount" data-value="amount"><button class="sub">-</button><span class="text">${item.amount}</span><button class="add">+</button></span>`;
    newItem.innerHTML +=
      '<button class="delete-button" data-action="workout-exercice">x</button>';
    newWorkout.children[1].appendChild(newItem);
  });

  addEventListeners();
};

const addNewExerciceToWorkout = (workoutId, exerciceName) => {
  const newItem = document.createElement("li");
  const id = Date.now();
  newItem.classList.add("draggable");
  newItem.setAttribute("data-id", id);
  newItem.setAttribute("data-exercice", exerciceName);
  newItem.setAttribute("draggable", true);
  newItem.innerHTML = `<span class="exercice">${exerciceName}</span>`;
  newItem.innerHTML += `<span class="sets" data-value="sets"><button class="sub">-</button><span class="text">0</span><button class="add">+</button></span>`;
  newItem.innerHTML += `<span class="x">x</span>`;
  newItem.innerHTML += `<span class="amount" data-value="amount"><button class="sub">-</button><span class="text">0</span><button class="add">+</button></span>`;
  newItem.innerHTML +=
    '<button class="delete-button" data-action="workout-exercice">x</button>';

  document
    .querySelector("[data-id='" + workoutId + "']")
    .children[1].appendChild(newItem);

  const workouts = localStorage.workouts
    .split("/")
    .map((item) => JSON.parse(item));

  workouts[workouts.findIndex((item) => item.id == workoutId)].exercices.push({
    id: id,
    name: exerciceName,
    sets: 0,
    amount: 0,
  });

  addEventListeners();

  saveWorkouts(workouts);
};

const saveWorkouts = (workouts) => {
  localStorage.setItem(
    "workouts",
    workouts.map((workout) => JSON.stringify(workout)).join("/")
  );
};

// $ END Functions
// ? FUNCTIONS OF BUTTONS
const addButtonHandler = (e) => {
  +e.target.parentElement.children[1].innerText++;

  const workoutId =
    e.target.parentElement.parentElement.parentElement.parentElement.getAttribute(
      "data-id"
    );
  const exerciceId =
    e.target.parentElement.parentElement.getAttribute("data-id");
  const property = e.target.parentElement.getAttribute("data-value");

  changeWorkoutValue(
    workoutId,
    exerciceId,
    property,
    +e.target.parentElement.children[1].innerText
  );
};

const subButtonHandler = (e) => {
  if (0 < e.target.parentElement.children[1].innerText) {
    +e.target.parentElement.children[1].innerText--;

    const workoutId =
      e.target.parentElement.parentElement.parentElement.parentElement.getAttribute(
        "data-id"
      );
    const exerciceId =
      e.target.parentElement.parentElement.getAttribute("data-id");
    const property = e.target.parentElement.getAttribute("data-value");

    changeWorkoutValue(
      workoutId,
      exerciceId,
      property,
      +e.target.parentElement.children[1].innerText
    );
  }
};

const changeWorkoutValue = (workoutId, exerciceId, property, value) => {
  const workouts = localStorage.workouts
    .split("/")
    .map((item) => JSON.parse(item));

  const exercice =
    workouts[workouts.findIndex((item) => item.id == workoutId)].exercices[
      workouts[
        workouts.findIndex((item) => item.id == workoutId)
      ].exercices.findIndex((item) => item.id == exerciceId)
    ];
  if (property == "sets") {
    workouts[workouts.findIndex((item) => item.id == workoutId)].exercices[
      workouts[
        workouts.findIndex((item) => item.id == workoutId)
      ].exercices.findIndex((item) => item.id == exerciceId)
    ] = {
      id: exercice.id,
      name: exercice.name,
      amount: exercice.amount,
      sets: value,
    };
  }
  if (property == "amount") {
    workouts[workouts.findIndex((item) => item.id == workoutId)].exercices[
      workouts[
        workouts.findIndex((item) => item.id == workoutId)
      ].exercices.findIndex((item) => item.id == exerciceId)
    ] = {
      id: exercice.id,
      name: exercice.name,
      amount: value,
      sets: exercice.sets,
    };
  }

  saveWorkouts(workouts);
};

const displayNone = (element) => {
  element.style.animation = "ElementDelete 0.25s linear";
  element.addEventListener("animationend", () => {
    element.style.display = "none";
  });
};

const deleteButtonHandler = (e) => {
  const action = e.target.getAttribute("data-action");

  const parent = e.target.parentElement;

  switch (action) {
    case "exercice":
      localStorage.setItem(
        "exercices",
        localStorage.exercices
          .split("/")
          .map((item) => JSON.parse(item))
          .filter((item) => item.id != parent.getAttribute("data-id"))
          .map((item) => JSON.stringify(item))
          .join("/")
      );
      displayNone(parent);

      break;

    case "workout":
      localStorage.setItem(
        "workouts",
        localStorage.workouts
          .split("/")
          .map((item) => JSON.parse(item))
          .filter((item) => item.id != parent.getAttribute("data-id"))
          .map((item) => JSON.stringify(item))
          .join("/")
      );
      displayNone(parent);

      break;

    case "workout-exercice":
      const exerciceId = +parent.getAttribute("data-id");
      const workoutId =
        +parent.parentElement.parentElement.getAttribute("data-id");

      const workouts = localStorage.workouts
        .split("/")
        .map((item) => JSON.parse(item));

      workouts[workouts.findIndex((item) => item.id == workoutId)].exercices =
        workouts[
          workouts.findIndex((item) => item.id == workoutId)
        ].exercices.filter((item) => item.id != exerciceId);

      saveWorkouts(workouts);

      displayNone(parent);

      break;

    default:
      break;
  }
};

// % DRAG AND DROP FUNCTIONALITY
let dragStartElement;
let dragEndElement;

const addEventListeners = () => {
  const draggables = document.querySelectorAll(".draggable");
  const draggableLists = document.querySelectorAll(".draggable-list");
  //const draggableListItems = document.querySelectorAll(".draggable-list li");

  const addButtons = document.querySelectorAll("button.add");
  const subButtons = document.querySelectorAll("button.sub");

  const deleteButtons = document.querySelectorAll("button.delete-button");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
  });

  draggableLists.forEach((list) => {
    list.addEventListener("dragover", dragOver);
    list.addEventListener("dragenter", dragEnter);
    list.addEventListener("drop", dragDropOnList);
  });

  /*draggableListItems.forEach((item) => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });*/

  addButtons.forEach((btn) => btn.addEventListener("click", addButtonHandler));
  subButtons.forEach((btn) => btn.addEventListener("click", subButtonHandler));

  deleteButtons.forEach((btn) =>
    btn.addEventListener("click", deleteButtonHandler)
  );
};

const dragStart = (e) => {
  dragStartElement = e.target.closest("li");
};
const dragOver = (e) => {
  e.preventDefault();
};

const dragDrop = () => {};

const dragDropOnList = (e) => {
  dragEndElement = e.target.closest("div.container-workout");

  addNewExerciceToWorkout(
    dragEndElement.getAttribute("data-id"),
    dragStartElement.getAttribute("data-exercice")
  );
};

const dragEnter = () => {
  //console.log("dragEnter", this.innerHTML);
};
const dragLeave = () => {
  //console.log("dragLeave", this.innerHTML);
};

// % END DRAG AND DROP FUNCTIONALITY

//Listeners
window.addEventListener("load", onLoadWindow());
FormAddExercice.addEventListener("submit", (e) => addExerciceHandler(e));
FormAddWorkout.addEventListener("submit", (e) => addNewWorkoutHandler(e));
