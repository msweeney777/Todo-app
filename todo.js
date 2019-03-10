const datastore = [];
const completed_list = [];

// Input functions:
function add_task (add_task) {
  const id = datastore.length + 1;
  const task = add_task;
  task.Id = id;
  task.Created_date = Date();
  task.isComplete = false;
  datastore.push(task);
}

function edit_task(edit_task) {
  for(let i = 0; i < datastore.length; i++){
    if(edit_task.Id === datastore[i].Id){
      datastore[i].Name = edit_task.Name;
      datastore[i].Description = edit_task.Description;
      datastore[i].Due_date = edit_task.Due_date;
    }
  }
}

function delete_task(delete_task) {
  for(let i = 0; i < datastore.length; i++){ 
    if(delete_task.Id === datastore[i].Id){
      delete datastore[i];
    }
  }
  console.log('Task deleted');
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

}

function list_active () {

}

task_1 = {
  Name: "First test task",
  Description: "Example",
  Due_date: "12/21/19"
}

add_task(task_1);

edit_task_1 = {
  Name: "New test task",
  Description: "New description",
  Due_date: "09/12/19",
  Id: 1
}

task_1_delete = {
  Id: 2
}

complete_task(task_1)

list_completed();


