const mongoose = require("mongoose")




const CouponsSchema = new mongoose.Schema({

    name : {
        type:String,
        trim:true,
        required:[true,"Coupon name is required"],
        unique:[true,"Coupon name must be unique"],
        
    },
    expire :{
        type:Date,
        required:[true,"Coupon expire date is required"],
    },
    discount : {
        type: Number,
        required:[true,"Coupon discount  is required"],
    }

},

{timestamps:true})


module.exports = mongoose.model('Coupon',CouponsSchema)