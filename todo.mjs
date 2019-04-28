import fs from 'fs';
import chalk from 'chalk';

//Parse the command line for a command - targeting the pertinent function - a
//task and a description
const command = (process.argv.slice(2,3)).pop();
const task = (process.argv.slice(3,4)).pop();
const description = (process.argv.slice(4, 5)).pop();
const update = (process.argv.slice(5, 6)).pop();
const updateDes = (process.argv.slice(6, 7)).pop();

// Read file from disk:
//
//let data = fs.readFileSync('/tmp/test') 
//let info = JSON.parse(data);

// For connecting parsed command/inputs with its pertinent function and output
if(command == 'add') {
  addTask(task, description);
} else if(command == 'remove' && task == "--id" && !isNaN(description)) {
  deleteTask(description);
} else if(command == 'help') {
  help();
} else if(command == 'list') {
  listTasks();
} else if (command == 'edit' && task == "--id" && !isNaN(description)) {
  editTask(description);
}  else if (command == 'update' && task == "--id" && !isNaN(description)) {
  completeTask(description);
} else if (command == 'completed') {
  listCompleted();
} else if (command == 'deleted') {
  listDeleted();
} else if (command == 'default') {
  setDefault();
} else {
  console.log('Error: Input not recognized. Type help for commands and proper command line syntax.');
}

//In case there is nothing written into the JSON file or stored info needs to be
//erased:
function setDefault () {
  let info = {todos: [], completed: [], deleted: []};
  let data = JSON.stringify(info, null, 2);

  fs.writeFile('datastore.json', data, (err) => {
    if (err) throw err;
    console.log('Default rest');
  })
}

// Input functions:

// Writes a task object to the datastore file
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
//Finds the task object with the matching id and allows the user to edit both the task title and
//task description from command line
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
     
    stat.deleted.push((stat.todos.filter((el) =>  {return el.id == id}).pop()));

    stat.todos = stat.todos.filter((el) =>  {return el.id != id})
    data = JSON.stringify(stat, null, 2);
    
    fs.writeFile('datastore.json', data, (err) => {
    if(err) throw err; 
    console.log("Task deleted."); 
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
     
    stat.completed.push((stat.todos.filter((el) =>  {return el.done == true}).pop()));

    stat.todos = stat.todos.filter((el) =>  {return el.done == false})
    data = JSON.stringify(stat, null, 2);
    
    fs.writeFile('datastore.json', data, (err) => {
    if(err) throw err; 
    console.log("Task updated."); 
    listTasks();
    })
  })
}

// Output functions:

// Shows the list of unfinished tasks in the datastore.json file
function listTasks () { 
  fs.readFile('datastore.json', (err, data) => {
    if(err) throw err;   
    let stat = JSON.parse(data); 

    stat.todos.forEach(({id, task, done, description}) => {
      console.log(`${chalk.magenta(id)} ${done ? chalk.green('DONE') : chalk.yellowBright('NOT DONE')} - ${chalk.whiteBright(task)} : \n${description}`);
    })  
  })
}

// Shows a list of completed tasks which have been removed from the nested
// 'todos' array and put into the the 'completed' array
function listCompleted () {
  fs.readFile('datastore.json', (err, data) => {
    if(err) throw err;   
    let stat = JSON.parse(data); 

    stat.completed.forEach(({id, task, done, description}) => {
      console.log(`${chalk.magenta(id)} ${done ? chalk.green('DONE') : chalk.yellowBright('NOT DONE')} - ${chalk.whiteBright(task)} : \n${description}`);
    })  
  })
} 

// Shows the list of deleted tasks that have been moved from the 'todos' array
// to the 'deleted' array
function listDeleted () {
  fs.readFile('datastore.json', (err, data) => {
    if(err) throw err;   
    let stat = JSON.parse(data);

    stat.deleted.forEach(({id, task, done, description}) => {
      console.log(`${chalk.magenta(id)} ${done ? chalk.green('DONE') : chalk.yellowBright('NOT DONE')} - ${chalk.whiteBright(task)} : \n${description}`);
    })
  })
}

//Miscellaneous functions:

// Prints the cli commands
function help () {
  console.log(`Commands are as follows: \nadd [task] [task description] \nedit --id [id#] [task] [task description] \nupdate --id [id#] \nremove --id [id#]\nlist \ncompleted \ndeleted \ndefault`)
}

//Write file to disk
//data = JSON.stringify(info, null, 2);
//fs.writeFileSync('/tmp/test', data);
