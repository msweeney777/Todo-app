import fs from 'fs';
import chalk from 'chalk';

//Parse the command line for a command - targeting the pertinent function - a
//task and a description
const command = (process.argv.slice(2,3)).pop();
const task = (process.argv.slice(3,4)).pop();
const description = (process.argv.slice(4, 5)).pop();
const update = (process.argv.slice(5, 6)).pop();
const updateDes = (process.argv.slice(6, 7)).pop();

// Read file and write state to disk:
//
//fs.readFile('/tmp/test', (err, data) => {
//  if(err) throw err;  
//  
//  let info = JSON.parse(data);
//
//  data = JSON.stringify(info, null, 2);
//
//  fs.writeFile('/tmp/test', data, (err) => {
//    if(err) throw err;    
//  })
//});

// For connecting parsed command/inputs with the pertinent function and output
if(command == 'add') {
  addTask(task, description);
} else if(command == 'remove' && task == "--id" && !isNaN(description)) {
  deleteTask(description);
} else if(command == 'help') {
  help();
} else if(command == 'list') {
  listTasks();
} else if (command == 'edit') {
  editTask(description);
}  else if (command == 'update' && task == "--id" && !isNaN(description)) {
  completeTask(description);
} else if (command == 'completed') {
  listCompleted();
} else {
  console.log('Error: Input not recognized ');
}

//In case there is nothing written into the JSON file:
function setDefault () {
  let info = {todos: []};
  let data = JSON.stringify(info, null, 2);

  fs.writeFile('datastore.json', data, (err) => {
    if (err) throw err;
    console.log('Default written to file');
  })
}

// Input functions:

// Writes a task object to the datastore JSON file
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
    fs.writeFile('datastore.json', data, (err) => {
      if(err) throw err; 
      console.log("Task written to file"); 
    listTasks();
    })
  })
}
//Finds the task object with the matching id and edits both the task title and
//task description
function editTask(id) {
  fs.readFile('datastore.json', (err, data) => {
    if(err) throw err;   
    let stat = JSON.parse(data);
    
    for (let key in stat.todos) {
      if(stat.todos[key].id == id) {
        stat.todos[key].task = update;
        stat.todos[key].description = updateDes;
      }
    }

    data = JSON.stringify(stat, null, 2);
    fs.writeFile('datastore.json', data, (err) => {
      if(err) throw err; 
      console.log("Task edited"); 
    listTasks();
    })
  })
}
//Targets the pertinent task object for removal from the datastore.json file
function deleteTask(id) {
  fs.readFile('datastore.json', (err, data) => {
    if(err) throw err;   
    let stat = JSON.parse(data);
    if(stat.todos.length > 1) {
      stat.todos = stat.todos.filter((el) =>  {return el.id != id})
    } else {
      stat.todos.pop(); 
    }

    data = JSON.stringify(stat, null, 2);
    
    fs.writeFile('datastore.json', data, (err) => {
      if(err) throw err; 
      console.log("Task removed.");  
    listTasks();
    })
  })
}

function completeTask(id){
  fs.readFile('datastore.json', (err, data) => {
    if(err) throw err;   
    let stat = JSON.parse(data);

    for(let el in stat.todos) {
      if(stat.todos[el].id == id) {
        stat.todos[el].done = true;
      }
    }
    let completed = [];
    if(stat.todos.length > 1) {
      completed = stat.todos.filter((el) =>  {return el.done == true})
      stat.todos = stat.todos.filter((el) =>  {return el.done == false})
    } else {
      completed = stat.todos.pop(); 
      stat.todos = stat.todos.pop();
    }
    //console.log(completed);

    data = JSON.stringify(stat, null, 2);
    
    fs.writeFile('datastore.json', data, (err) => {
    if(err) throw err; 
    console.log("Task updated."); 
    listTasks();
    })

    data = JSON.stringify(completed, null, 2);
    fs.writeFile('completedList.json', data, (err) => {
    if(err) throw err; 
    })
  })
}

// Output functions:

// Shows a list of tasks stored in the datastore.json file on command
function listTasks () { 
  fs.readFile('datastore.json', (err, data) => {
    if(err) throw err;   
    let stat = JSON.parse(data); 

    stat.todos.forEach(({id, task, done, description}) => {
      console.log(`${chalk.magenta(id)} ${done ? chalk.green('DONE') : chalk.yellowBright('NOT DONE')} - ${chalk.whiteBright(task)} : \n${description}`);
    })  
  })
}

function listCompleted () {
  fs.readFile('completedList.json', (err, data) => {
    if(err) throw err;   
    let stat = JSON.parse(data); 

    stat.completed.forEach(({id, task, done, description}) => {
      console.log(`${chalk.magenta(id)} ${done ? chalk.green('DONE') : chalk.yellowBright('NOT DONE')} - ${chalk.whiteBright(task)} : \n${description}`);
    })  
  })
} 

function listDeleted () {

}

function help () {
  console.log(`Commands are as follows: \nadd [task] [task description] \nedit --id [id#] [task] [task description] \nupdate --id [id#] \nlist`)
}
