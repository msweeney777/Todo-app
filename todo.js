const fs = require('fs');
const linebyline = require('readline');
const datastore = [];
const completed_list = [];
const deleted_list = [];
let count = 0;
const newObj = {};


// Read file and write state to disk:
fs.readFile('/tmp/test', (err, data) => {
  if(err) {
    throw err;  
  }
  let info = JSON.parse(data);
  //console.log(info);
  //console.log('Message successfully parsed back from JSON');
});

// Command line input information: Task, description, due date:
linebyline
  .createInterface({
    input: process.stdin,
    output: process.stdout
 })
  .on('line', handleResponse);

 prompt();

function prompt() {
  process.stdout.write('\nTask Title?\n');
}

function handleResponse (input) {
  const response = input.trim();
  if(count == 0) {
    process.stdout.write('\nAdd description?\n');
    newObj.Name = response;
    console.log(newObj);
  } else if (count == 1) {
    newObj.Description = response; 
    console.log(newObj);
    dueDate();
  } else {
    newObj.Due_date = response; 
    console.log(newObj);
    add_task(newObj);
    list_tasks();
  }
  count++; 
  console.log(count);
  //console.log(newObj);
  //} else {
   // dueDate();
  //}
}

function dueDate() {
    process.stdout.write('\nDue date?\n');  
}
// Input functions:
function add_task (new_task) {
  const id = datastore.length + 1;
  const task = new_task;
  task.Id = id;
  task.Created_date = Date();
  task.isComplete = false;
  datastore.push(task);
}

function edit_task(task) {
  for(let i = 0; i < datastore.length; i++){
    if(task.Id === datastore[i].Id){
      datastore[i].Name = task.Name;
      datastore[i].Description = task.Description;
      datastore[i].Due_date = task.Due_date;
    }
  }
}

function delete_task(delete_task) {
  for(let i = 0; i < datastore.length; i++){ 
    if(delete_task.Id === datastore[i].Id){
      deleted_list.push(datastore[i]);
      delete datastore[i];
    }
  }
}

function complete_task(complete_task){
  for(let i = 0; i < datastore.length; i++) {
    if(complete_task.Id === datastore[i].Id){
      if(!complete_task.isComplete){
        datastore[i].isComplete = true;
      }
    }
  }
}

// Output functions:

function get_task (get_task) {
  for(let i = 0; i < datastore.length; i++){ 
    if(get_task.Id === datastore[i].Id){
      console.log(datastore[i]);
      return datastore[i];
    }
    console.log('No such task exists.')
  } 
}

function list_tasks () {
  console.log(datastore);
}

function list_completed () {
  for(let i = 0; i < datastore.length; i++){ 
    if(datastore[i].isComplete){
      completed_list.push(datastore[i]);
      console.log(completed_list);
    }
  } 
} 

function list_deleted () {
  console.log("Deleted Tasks:")
  console.log(deleted_list);
}

function list_active () {

}

task_1 = {
  Name: "First test task",
  Description: "Example",
  Due_date: "12/21/19"
}

//add_task(task_1);

edit_task_1 = {
  Name: "New test task",
  Description: "New description",
  Due_date: "09/12/19",
  Id: 1
}

task_1_delete = {
  Id: 2
}

//complete_task(task_1)

//list_completed();
//delete_task(task_1);
//list_deleted();

//console.log(JSON.stringify(datastore));


fs.writeFile('/tmp/test', JSON.stringify(datastore), function(err) {
  if(err) {
    return console.log(err);
  }
  //console.log("The file was saved");
})
