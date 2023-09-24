const Dotenv = require('dotenv');
const Express = require('express');
const App = Express();
const Cors = require('cors');
const Path = require('Path');

Dotenv.config({path: './config.env'})
require('./DB/Conn')

App.use(Cors());

App.use(Express.json())

const PORT = process.env.PORT || 5000;

App.use(Express.static(Path.join())); 

App.use(require("./router/registerRoute.js"))
App.use(require("./router/loginRoute.js"))

App.listen(PORT);