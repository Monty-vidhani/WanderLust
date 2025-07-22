const express = require("express") ;
const app = express() ;
const mongoose = require("mongoose") ;
const Listing = require("./models/listings.js") ;
const path = require("path");
const methodOverride =  require("method-override")
const ejsMate = require("ejs-mate") ;
const passport  = require("passport");
const localStrategy = require("passport-local") ;
const User = require("./models/user.js") ;
const session = require("express-session") ;
require("dotenv").config();


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")) ;
app.use(express.urlencoded({extended:true})) ;
app.use(methodOverride("_method")) ;
app.engine('ejs', ejsMate) ;
app.use(express.static(path.join(__dirname,"/public")));
const sessionOptions  = {
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000 ,
        maxAge: 7*24*60*60*1000 ,
        httpOnly: true,
    }
} ; 
app.use(session(sessionOptions)) ;
// app.use(flash()) ;
app.use(passport.initialize()) ;
app.use(passport.session()) ;
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()) ;
passport.deserializeUser(User.deserializeUser()) ;
// app.use((req,re,next)=>{
//     res.local.success = req.flash("success") ;
//     next() ;
// })

// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username:"aplha-student"
//     }) ;

//   let registereduser = await  User.register(fakeUser,"helloworld") ;
//   res.send(registereduser) ;
// })

app.get("/signup",(req,res)=>{
    res.render("./signup/signup.ejs") ;
})

app.post("/signup",async (req,res)=>{
        let{username,email,password} = req.body ;
        const newUser = new  User({email,username}) ;
        let registeredUser = await User.register(newUser,password) ;
        // console.log(registeredUser) ;
        res.redirect("/listings") ;
})

main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(process.env.MONGO_URL) ;
}

// app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views")) ;
// app.use(express.urlencoded({extended:true})) ;
// app.get("/testListings",async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India",
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful");
// });

// read route
app.get("/listings",async(req,res)=>{
   const allListings = await Listing.find({}) ;
   res.render("./listings/index.ejs",{allListings});
});

// New route
app.get("/listings/new",async(req,res)=>{
    res.render("./listings/new.ejs") ;
});

// show route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params ;
    const listing = await Listing.findById(id) ;
    res.render("./listings/show.ejs",{listing});
});

// create route
app.post("/listings",async(req,res,next)=>{
   try{
     const newListing = new Listing(req.body.listing) ;
    await newListing.save() ;
    res.redirect("/listings") ;
   }catch(err){
        next(err) ;
   }
})


// Edit route
app.get("/listings/:id/edit", async(req,res)=>{
     let {id} = req.params ;
    const listing = await Listing.findById(id) ;
    res.render("./listings/edit.ejs",{listing})
})


// Update route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params ;
   await Listing.findByIdAndUpdate(id,{ ...req.body.listing });
   res.redirect(`/listings/${id}`)
})



// Delete route
app.delete("/listings/:id", async(req,res)=>{
    let {id} = req.params ; 
    await Listing.findByIdAndDelete(id) ;
    res.redirect("/listings");
});
app.get("/",(req,res)=>{
    res.send("Hi, I am root");
})


app.use((err,req,res,next)=>{
    res.send("something went wrong") ;
})

app.listen(8080,()=>{
    console.log("listening to port 8080");
})
