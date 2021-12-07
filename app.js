const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require ("mongoose");
var bodyParser = require("body-parser");
const passport = require('passport');
 

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
//passport config
require('./config/passport')(passport);
//DB Config
const db = require('./config/keys').MongoURI;
const passport = require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());
  
//Connect to mongo
mongoose.connect(db, {useNewUrlParser : true})
.then(()=>console.log("MongoDB Connected..."))
.catch(err=>console.log(err));
//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs'); 

//BodyParser
app.use(express.urlencoded({extended: false}));

//routes
app.use('/' , require('./routes/index'));
app.use('/users' , require('./routes/users'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`)); 