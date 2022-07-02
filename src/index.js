//Importing node packages and third party packages
const express = require("express");
const cors = require('cors')

//Importing from within the src
const connect = require("./configs/db")
const authController = require("./controllers/auth.controller"); 
const tokenController = require('./controllers/token.controller');

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

//routes
app.use("/auth", authController);
app.use('/token', tokenController);


//connecting to server and database;
app.listen(process.env.PORT||2345, ()=>{
    connect();
    console.log("listening on port 2345");
})