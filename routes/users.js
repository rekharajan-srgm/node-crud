const express = require("express");
const { contentType, append } = require("express/lib/response");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const verify = require("./verifytoken");
const bcrypt = require("bcryptjs");
const fileupload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { decode } = require("punycode");
var base64 = require('base-64');
const jimp=require('jimp');
console.log("waiting for request");
/*
//set storage **********************
var storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'uploads/');
  },
  filename:function(req,file,cb){
    cb(null,file.fieldname+'-'+Date.now());
  }
});
var upload=multer({storage:storage});
router.get('/',(req,res)=>{
res.render("index");
});
//***********************************/
//using the middleware multer to upload photo on server side
//var upload = multer({ dest: "./uploads" });

//get all users
router.get("/user", verify, async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const sort = req.query.sort ? parseInt(req.query.sort) : 1;
  var query = { firstName: /^a/ };
  //const mysort={firstName:1};
  try {
    //const mysort={firstName:1};
    const users = await User.find({})
      .sort({ firstName: sort })
      .limit(pageSize)
      .skip(pageSize * page);
    res.json(users);
  } catch (err) {
    res.send("Error" + err);
  }
});

//login validate
router.post("/validate", async (req, res) => {
  const username = req.body.firstName;
  const password = req.body.password;
  try {
    const user = await User.find({ firstName: username });
    //compare the password user entered with hashed pass.
    console.log(user[0].password);
    const hash_password = user[0].password;

    let result = await bcrypt.compareSync(password, hash_password);
    console.log("\n" + result + "\n");

    if (result) {
      //create and assign a token
      const token = jwt.sign(
        { _id: user[0]._id, user_id: user[0].firstName },
        process.env.TOKEN_SECRET,
        { expiresIn: "60m" }
      );
      
      res.header("users-token", token).send(token);
      console.log("password matched");
    } else {
      res.status(503);
      res.send('{"result":"Authentication failed"}');
    }
  } catch (err) {
    res.status(501);
    res.send("{'result':'server error occured.'}");
  }
});

//sign up
router.post("/user", async (req, res) => {
  console.log(req.body);
  //new code
  var fle = fs.readFileSync("C:\\Users\\rekha\\Pictures\\baby.jpg", "base64");

  //Hash Passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const request_user_object = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    confirmPassword: req.body.confirmPassword,
    acceptTandC: req.body.acceptTandC,
    img: fle,
  });
  //compare the password user entered with hashed pass.
  let result = bcrypt.compareSync(request_user_object.password, hashedPassword);
  console.log("\nthe password matched" + result + "\n");

  await request_user_object.save(function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.status(200);
      res.send(
        "the encrypted password is=" +
          hashedPassword +
          "\n" +
          "Signed up successfully"
      );
    }
  });
});

//delete user
router.delete("/user/:firstname", verify, async (req, res) => {
  const first_name_parameter = req.params["firstname"];
  User.deleteOne({ firstName: first_name_parameter }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send("deleted");
    }
  });
});

//update user
router.put("/user/:firstname", verify, async function (req, res, next) {
  User.findOneAndUpdate({ firstName: req.params["firstname"] }, req.body).then(
    function (user) {
      User.findOne({ firstName: req.params.firstname }).then(function (user) {
        res.send(user);
      });
    }
  );
});

//upload a profile picture
router.post("/user/:firstname/upload", fileupload(), async (req, res) => {
  
  var encoded_img = req.files.img.data.toString("base64");
  
  const base64=encoded_img;
  const image=Buffer.from(base64,"base64");
  fs.read("image.jpg",image);
  fs.writeFileSync(path.join(__dirname+'/uploads/'+"image.jpg"));
 const filepath=path.join(__dirname+'/uploads/');
 fs.openSync(filepath,"image.jpg");
 jimp.read(req.files.img.data, function (err, image) {
   if(err){
     console.log(err);
   }
   console.log(image);
 });
  User.findOneAndUpdate(
    { firstName: req.params["firstname"] },
    { img: encoded_img }
  ).then(function (user) {
    res.send("updated profile picture for user " + user.firstName);
  });
});

module.exports = router;
