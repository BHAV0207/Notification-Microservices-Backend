const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId : {type : String, required : true},
    products : [
        {
            productId : {type : String, required : true},
            quantity : {type : Number, required : true},
            category : {type : String, required : true},
        }
    ]
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order