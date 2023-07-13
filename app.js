const express = require("express");
const routesController = require("./Routes/routes");
const connection = require('./db/dbconfig')
const sess = require('./session/session_conf')
const cookieParser = require('cookie-parser');


const app = express();

const port = 80;
const host = '192.168.1.41';

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(sess);

app.get("/", (req, res) => {
    // console.log(req.session);
    res.render('home');
})


app.use(routesController);
//404 page
app.use((req, res, next) => {
    res.status(404).send(
        "<h1>404 Page not found</h1>")
})
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
})
