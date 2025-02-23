const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    userId : {type : String, required : true},
    userEmail : {type : String, required : true},
    type : {type : String, enum:["promotion", "order_update", "recommendation"] , required : true},
    content : {type : String, required : true},
    sendAt : {type : Date, default : Date.now},
    read : {type : Boolean, default : false}
})  

module.exports = mongoose.model('Notification', notificationSchema)