const express = require('express');
const app = express();
const studentRoute = require('./api/routes/student')
const stockRoute = require('./api/routes/stock')
const mongoose = require('mongoose');
const bodyparser = require('body-parser');


mongoose.connect('mongodb+srv://rishirewadkar:rishi123@stockmarketgame.t1sfwib.mongodb.net/?retryWrites=true&w=majority');

mongoose.connection.on('error', err => {
    console.log('connection failed');
});


mongoose.connection.on('connected', connected=>{
    console.log('connected with database STOCK MARKET GAME');
});

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use('/student', studentRoute);
app.use('/stock', stockRoute);
app.use((req,res,next)=>{
    res.status(404).json({
        error:'Bad request'
    })
})

/*
app.use((req,res,next)=>{
    res.status(200).json({
        message:'app is running here'
    })
})
*/
module.exports = app;