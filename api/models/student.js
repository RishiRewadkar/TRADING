const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name:String,
        email:String, 
        amount: Number,
        password: String, 
        IBM: Number
    }
)

module.exports = mongoose.model('Student', studentSchema);