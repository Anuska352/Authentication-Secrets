//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

main().catch(err => console.log(err));
 
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    const userSchema = new mongoose.Schema({
        email:String,
        password:String
    });
 
const User = mongoose.model('User',userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register",async(req,res)=>{
    try {
        const newUser = new User({
            email:req.body.username,
            password:req.body.password
        });
        const result = await newUser.save();
        if(result){
            res.render('secrets');
        }else{
            console.log("Login Failed");
        }
    } catch (err) {
        console.log(err);
    }
});


app.post("/login",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    try {
        const foundName = await User.findOne({email:username})
        if(foundName){
            if(foundName.password===password){
                res.render('secrets');
            }else{
                console.log('Password Does not Match...Try Again !')
            }
        }else{
            console.log("User Not found...")
        }
    } catch (err) {
        console.log(err);
    }
});



app.listen(3000, function(){
    console.log("Server started on port 3000.");
});

}