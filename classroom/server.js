const express = require("express");
const app = express() ;
const session = require("express-session") ;
const flash = require("connect-flash") ;
const sessionOptions  = {
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,

} ; 
app.use(flash()) ;


app.use(session(sessionOptions)) ;


app.get("/register" , (req,res)=>{
    let {name = "anonymous"} = req.query ;
    res.send(name) ;
})

// app.get("/test", (req,res)=>{
//     res.send("test successfull") ;
// }) ;

app.listen(3000,()=>{
    console.log("server is listening to port 3000") ;
})