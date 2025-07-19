const mongoose = require("mongoose");
const Schema = mongoose.Schema ;


const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://th.bing.com/th/id/R.e5bf1aa5d9af720eb2cfcef5879b629b?rik=OA8m1InCNCyJeg&riu=http%3a%2f%2fcms.inspirato.com%2fmedia%2f5723972%2fMauiWailea_Res_Andaz_Beach.jpg&ehk=UvStyufz0RpdAg9ZL1%2foD2DnaB9MKlXky0qXMwQpoVM%3d&risl=&pid=ImgRaw&r=0",
        set:(v)=> v===""? "https://th.bing.com/th/id/R.e5bf1aa5d9af720eb2cfcef5879b629b?rik=OA8m1InCNCyJeg&riu=http%3a%2f%2fcms.inspirato.com%2fmedia%2f5723972%2fMauiWailea_Res_Andaz_Beach.jpg&ehk=UvStyufz0RpdAg9ZL1%2foD2DnaB9MKlXky0qXMwQpoVM%3d&risl=&pid=ImgRaw&r=0":v ,
    },
    price:Number,
    location:String,
    country:String
});
const Listing = mongoose.model("Listing",listingSchema) ;
module.exports = Listing ;