const express = require('express');
const app = express();
const path = require('path');
const studentRoute = require('./api/routes/student')
const stockRoute = require('./api/routes/stock')
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const handlebars = require('express-handlebars');
const router = require('./api/routes/student');

app.engine('handlebars',handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views',path.join(__dirname, '/views'))


const cookieParser = require('cookie-parser');

app.get('/', (req,res)=>{
    res.render('main', {layout: 'index'}); 
})

app.get('/newuser', (req,res,next)=>{
    res.render('main', {layout: 'signup'});
});



mongoose.connect('mongodb+srv://rishirewadkar:rishi123@stockmarketgame.t1sfwib.mongodb.net/?retryWrites=true&w=majority');

mongoose.connection.on('error', err => {
    console.log('connection failed');
});


mongoose.connection.on('connected', connected=>{
    console.log('connected with database STOCK MARKET GAME');
});

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cookieParser());

app.use('/student', studentRoute);
app.use('/stock', stockRoute);
app.use((req,res,next)=>{
    res.status(404).json({
        error:'Bad request from here'
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