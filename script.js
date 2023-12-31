var app = (function () {
    let taskList = document.getElementById("list");
    let inputBar = document.getElementById("add");
    let taskCounter = document.getElementById("tasks-counter");

    let taskListArr = [];
    // For Giving Notifications
    function giveMessage(message, task = null) {
    let ele = document.getElementById("alert");
    if (task !== null)
        ele.innerHTML += `<div> <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
    "${task.title}"  ${message} </div>`;
    else
        ele.innerHTML += `<div> <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
    ${message} </div>`;
    }
    
    //Pushing Task in the List inside DOM
    function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.innerHTML = `
    <input type="checkbox" id="${task.id}" ${
        task.completed ? "checked" : ""
    } class="custom-checkbox">
    <label for="${task.id}" id = "task-name">${task.title}</label>
    <img src="bin.svg" class = "delete" data-id = "${task.id}">    
    `;
    taskList.append(li);
    }
    // Rendering the List
    function renderList() {
    taskList.innerHTML = "";
    for (let i = 0; i < taskListArr.length; i++) {
        addTaskToDOM(taskListArr[i]);
    }
    taskCounter.innerHTML = taskListArr.length;
    }
    // DELETE BUTTON
    function deleteTask(taskId) {
    const newTasks = taskListArr.filter(function (task) {
        return task.id !== Number(taskId);
    });
    const deletedTask = taskListArr.filter(function (task) {
        return task.id === Number(taskId);
    });
    taskListArr = [...newTasks];
    renderList();
    giveMessage("Tasks Deleted", deletedTask[0]);
    return;
    }
    //CHECK BOX
    function markTaskAsComplete(taskId) {
    const currtask = taskListArr.filter(function (task) {
        return task.id === Number(taskId);
    });

    if (currtask.length > 0) {
        const currentTask = currtask[0];

        currentTask.completed = !currentTask.completed;
        if (currentTask.completed === true)
        giveMessage("You Completed Task " + currentTask.title);
        else
        giveMessage("Your Task " + currentTask.title + " is still incomplete");
        return;
    } else {
        giveMessage("Marking as complete fail", "markTaskAsComplete");
    }
    }
    //Comparator Functions for sort()
    function sortAccToName(a, b) {
    return a.title.localeCompare(b.title);
    }
    function sortAccToTime(a, b) {
    return a.id - b.id;
    }
    //SORT BUTTON
    function sort(sortingType) {
    if (taskListArr.length === 0) {
        giveMessage("No task is currently present");
        return;
    }
    if (sortingType == "name") {
        taskListArr.sort(sortAccToName);
    } else {
        taskListArr.sort(sortAccToTime);
    }
    giveMessage("sorted according to " + sortingType);
    renderList();
    }

    //CLEAR BUTTON
    function clearList() {
      taskListArr.length = 0;
      let ele = document.getElementById("alert");
      ele.innerHTML = "Notifications ->";
      renderList();
    }
    //ADD BUTTON
    function addTask() {
      const text = inputBar.value;
      if (text.length !== 0) {
        const task = {
          title: text,
          id: Date.now(),
          completed: false,
        };
        taskListArr.push(task);
        renderList();
        inputBar.value = "";
        giveMessage("Task Added", task);
      } else {
        giveMessage("Task can not be empty");
      }
    }
    //EVENT DELEGATION
    function handleClick(e) {
      const target = e.target;
      //console.log(target.id);
      if (target.id === "addTask") {
        addTask();
      } else if (target.id === "clearToDos") {
        clearList();
      } else if (target.id === "time" || target.id === "name") {
        sort(target.id);
      } else if (target.className === "custom-checkbox") {
        const taskId = target.id;
        markTaskAsComplete(taskId);
      } else if (target.className === "delete") {
        const taskId = target.dataset.id;
        deleteTask(taskId);
      }
    }
    function handleKey(e) {
      const target = e.key;
      if (target == "Enter") {
        addTask();
      }
    }
    function appInitialize() {
      document.addEventListener("click", handleClick);
      document.addEventListener("keyup", handleKey);
      fetchToDos();
    }
    return {
      start: appInitialize,
    };
  })();