//Initailizing & Declaring Dependancies
const express=require("express");
const app=express();
const port=process.env.port || 3000;
const layout=require("express-ejs-layouts");
const flash=require("connect-flash");
const session=require("express-session");
const passport=require("passport");

// Passport Config
require('./config/passport')(passport);

//Body parser
app.use(express.urlencoded({extended: true}));

//Session
app.use(session({  secret:"$ecret0101", resave: true, saveUninitialized: true}));

//ejs setup
app.use(layout);                                  app.set("view engine","ejs");

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//Global variables
app.use((req,res,next)=>{                           res.locals.success_msg=req.flash("success_msg");
  res.locals.error_msg=req.flash("error_msg");
  res.locals.error=req.flash("error");
  next();                                         });

//Public files
app.use(express.static("./public"));

//Routes
app.use("/",require("./routes/index"));
app.use("/",require("./routes/users"));


//Port Addressing
app.listen(port,()=>console.log(`Listening at http://localhost:${port}`));
