const express = require('express');
const path = require('path');
const ent = require('ent');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = 3000;
let todoList;

// Set up Ejs engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/todo', (req, res) => {
    res.render('page');
});

// Routes that do not exist
app.use((req, res) => {
    res.redirect('/todo');
});

io.on('connection', (socket) => {    
    
    if(typeof(todoList) == 'undefined') {
        todoList = [];                
    }       
    // Sends the data to the client
    // who has just logged in
    io.emit('getTodoList', todoList);

    socket.on('addElement', (element) => {
        if(element != ''){
            element = ent.encode(element);
            todoList.push(element);
            io.emit('getTodoList', todoList);
        }        
    });

    socket.on('deleteElement', (id) => {    
        todoList.splice(id, 1);
        io.emit('getTodoList', todoList);    
    });

})

server.listen(port, () => { console.log('Server running on port '+port)});

