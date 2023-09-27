const Dotenv = require('dotenv');
const Express = require('express');
const App = Express();
const Cors = require('cors');
const Path = require('Path');
const mongoose = require('mongoose');

Dotenv.config({path: './config.env'})

App.use(Cors());

App.use(Express.json())

const PORT = process.env.PORT || 5000;

App.use(Express.static(Path.join())); 

App.use(require("./router/registerRoute.js"))
App.use(require("./router/loginRoute.js"))

const DB = process.env.DATABASE;

mongoose.connect(DB,{
      useNewUrlParser : true,
      useUnifiedTopology:true,
}).then(()=>{
      console.log("connection successfull");
      App.listen(PORT);
}).catch((err)=>{
      console.log(err);
})
