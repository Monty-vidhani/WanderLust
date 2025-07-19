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
require("dotenv").config();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")) ;
app.use(express.urlencoded({extended:true})) ;
app.use(methodOverride("_method")) ;
app.engine('ejs', ejsMate) ;
app.use(express.static(path.join(__dirname,"/public")));


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
