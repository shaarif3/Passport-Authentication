const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require('passport');
//Login page
router.get("/login", (req, res) => res.render("login"));

//Register page
router.get("/register", (req, res) => res.render("register"));

//Register Handle
router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill in all fields" });
  }

  //check password match
  if (password !== password2) {
    errors.push({ msg: "passwords donot match" });
  }

  //check password length
  if (password.length < 6) {
    errors.push({ msg: "password should be atleast 6 characters!" });
  }

  if (errors.length > 0) {
    res.status(400).json(errors);
  } else {
    const isExist = await User.findOne({ email });
    // if(isExist) return res.status(400).json({success:false,message:"User Already Exist"})
    if (isExist) {
      errors.push({ msg: "Email already exist!" });
      res.status(400).json(errors);
      return;
    } else {
      let userCreated = new User({
        name,
        email,
        password,
      });

      //hash password
      bcrypt.genSalt(12, (err, salt) =>
        bcrypt.hash(userCreated.password, salt,async (err, hash) => {
          if (err) throw err;
          //set password to hashed
          userCreated.password = hash;
          await userCreated.save();
          res.status(201).json(userCreated);
        })
      );
    }
  }
  // console.log(req.body)
  // res.send("hello");
});

//login handle
router.post('/login', (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login'
})(req,res,next);
});

module.exports = router;
