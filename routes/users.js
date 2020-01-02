const express=require("express");
const router=express.Router();              const passport=require("passport");      
var db=require("../config/db.js");
var bcrypt = require('bcryptjs');
const { forwardAuthenticated } = require('../config/auth');

router.get("/register",forwardAuthenticated,(req,res)=>{
                                                          res.render("register",{title: "Registration Page"});

});

router.get("/login",forwardAuthenticated,(req,res)=>{

        res.render("login",{title: "Login form "});

});

router.get("/users",(req,res)=>{
		db.find({},(err,docs)=>{
		res.json(docs);
});
                                                                      });


router.post("/register",(req,res)=>{
  var {name , email, password, password2}=req.body;
  var errors=[];
  if(!name || !email||!password ||!password2 ){
	errors.push({msg: "All fields are Required"});
  }
  if(name.length<4 ||  name.length>24){
        errors.push({msg: "Name must be atleast 4 characters and atmost 24"});
  }
  if(password.length<=7 ){
        errors.push({msg: "Password must be atleast 8 characters"});
  }
  if(password!==password2 ){
        errors.push({msg: "The password you entered dont match each other"});
  }
  if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
	errors.push({msg: "The entered Email is not valid"});}

  if(errors.length>0){
   return res.render("register",{
  title: "Registration Page",
  errors,
  name,
  email,
  password,
  password2
});
}
  else{
  db.findOne({email },(err, doc)=> {
	  if(doc){
   errors.push({msg: "This Email Already registered"});
  return res.render("register",{
  title: "Registration Page",                       errors,                                           name,
  email,
  password,
  password2
  });
}
	  else{
	let userData={
	  name,
	  email,
	  password,
	  timeStamp: Date.now()
	}
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(userData.password, salt, function(err, hash) {
        if(err) throw err;
	else{
	  userData.password=hash;
	  db.insert(userData,(err, newDocs)=> {          if(err) throw err;                                else console.log("A user registered");

});
	req.flash("success_msg","You're now Registered. Login to continue");                               res.redirect("/login");
	}
    });
});

}
});
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});




module.exports=router;
