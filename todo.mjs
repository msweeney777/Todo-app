import fs from 'fs';
import chalk from 'chalk';
const command = (process.argv.slice(2,3)).pop();
const task = (process.argv.slice(3,4)).pop();
const description = (process.argv.slice(4)).pop();

// Read file and write state to disk:
//fs.readFile('/tmp/test', (err, data) => {
//  if(err) {
//    throw err;  
//  }
//  let info = JSON.parse(data);
//  data = JSON.stringify(info, null, 2);
//
//  fs.writeFile('/tmp/test', data, (err) => {
//    if(err) {
//      return console.log(err);
//    }
//  })
//});

// Command line input information: Task, description, due date:
function setDefault () {
  let info = {todos: []};
  let data = JSON.stringify(info, null, 2);

  fs.writeFile('datastore.json', data, (err) => {
    if (err) throw err;
    console.log('Default written to file');
  })
}
function handleResponse (input) {
  const response = input.trim();
  if(count == 0) {
    process.stdout.write('\nDescription?\n');
    newObj.Name = response;
    console.log(newObj);
  } else if (count == 1) {
    newObj.Description = response; 
    console.log(newObj);
    dueDate();
  } else if (count == 2){
    newObj.Due_date = response; 
    console.log(newObj);
    add_task(newObj);
    list_tasks();
  }
  count++; 
}
//setDefault();
// Input functions:
function addTask (task, description) {
  fs.readFile('datastore.json', (err, data) => {
    if(err) throw err;   
    let stat = JSON.parse(data);

    stat.todos.push({
      task,
      description,
      id: stat.todos.length,
      Created_date: Date(),
      done: false
    });
    data = JSON.stringify(stat, null, 2);
    console.log(data);
    fs.writeFile('datastore.json', data, (err) => {
    if(err) throw err; 
    console.log("Info written to file"); 
    })
  })

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

function delete_task(id_) {
  fs.readFile('datastore.json', (err, data) => {
    if(err) throw err;   
    let stat = JSON.parse(data);
    if(stat.todos.length > 1) {
      stat.todos = stat.todos.filter((el) =>  {return el.id != id_})
    } else {
      stat.todos.pop(); 
    }

    data = JSON.stringify(stat, null, 2);
    
    fs.writeFile('datastore.json', data, (err) => {
    if(err) throw err; 
    console.log("Task removed."); 
    })
  })
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

if(command == 'add') {
  addTask(task, description);
} else if(command == 'remove') {
  delete_task(description);
} else if(command == 'delete-log') {
  console.log('the delete-log command has not been wired in yet.')
} else if(command == 'list') {
  list_tasks();
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
  fs.readFile('datastore.json', (err, data) => {
    if(err) throw err;   
    let stat = JSON.parse(data);
    const res = stat.todos;
    res.forEach(({id, task, done, description}) => {
      console.log(`${chalk.magenta(id)} ${done ? chalk.green('DONE') : chalk.yellowBright('NOT DONE')} - ${chalk.whiteBright(task)} : \n${description}`);
    })
  })
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
