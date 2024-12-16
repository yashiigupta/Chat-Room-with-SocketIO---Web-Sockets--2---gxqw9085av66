// importing required modules
const express = require('express');
const path = require('path');
require('dotenv').config();

// creating an express app, then an http server, which is then passed to socketio
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http);

// This will contain all the users
const users = [];

// Setting up of port 
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

/////////////////////// IMPLEMENT BELOW STEPS //////////////////////

// Setup io to listen to new connection and then inside its callback implement

  // Send {username:"Bot", message:"Welcome to chatbox"} about "message" to current socket only

  // Listen for "userJoin" from client to get new username, add him to users array as {id: socket.id, username: username},
  // send {username:"Bot",message:`${username} has joined the chat`} about "message" to everyone except current socket and
  // send updated users array about "updateUsers" to every socket

  // Listen for "disconnect", find the username from users array matching socket.id and 
  // send {username:"Bot",message:`${username} has left the chat`} about "message" to everyone except current socket
  // also remove the user from users array send updated users array about "updateUsers" to every socket

  // Listen for "chatMessage" for any message and send {username:msg.username,message:msg.message} about "message" to every socket

  io.on("connection", (socket) => {

    socket.on("userJoin", (data) => {
      var user = JSON.parse(data);
      users.push({id: socket.id, username: user.username});
      socket.broadcast.emit("message", {username:"Bot",message:`${user.username} has joined the chat`});
      io.emit("updateUsers", users);
    })

    socket.emit("message", {username: "Bot", message: "Welcome to chatbox"})

    socket.on("disconnect", () => {
      const user = users.findIndex(item => item.id === socket.id);
      socket.broadcast.emit("message", {username:"Bot",message:`${users[user].username} has left the chat`})
      if(user != -1) users.splice(user, 1);
      io.emit("updateUsers", users);
    })

    socket.on("chatMessage", (msg) => {
      msg = JSON.parse(msg);
      io.emit("message", {username:msg.username, message:msg.message});
    })
  })


let server = http.listen(port, () => console.log(`Server Running at port ${port}`));

if (process.env.NODE_ENV === 'testing') {
  console.log('will kill the server after 30sec')
  setTimeout(() => {
    server.close()
  }, 60000);

}

exports.server = server
