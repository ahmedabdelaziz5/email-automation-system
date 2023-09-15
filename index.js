const express = require("express");
const app = express();

const cors = require('cors');

app.use(express.json());

app.use(cors()); // http -> https  

require("dotenv").config();

// db config  
const {connection} = require("./config/db.config");
connection();

//routes
app.use(require('./routes/user.route'));
app.use(require('./routes/templates.route'));
app.use(require('./routes/event.route'));

const http = require("http");
const server = http.createServer(app);

//production port
server.listen(process.env.PORT || 3000, process.env.LOCAL_HOST || "0.0.0.0", () => {
    console.log(`Server is up and runing on port ${process.env.PORT}!`)
})

// const x = new Date(2023, 8, 16, 1, 2, 0);
// console.log(x)

// handle failer in scheduled jobs (update status of event->faild)
// send failer emails to users ( scheduleEmails, sendEmails)
// optimize await calls using Promis.all
 