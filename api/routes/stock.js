/*
get stock data api show live stock data of all the stocks 

buy order 

sell order

rank 

net worth 

*/


const express = require('express');
const router = express.Router();
const Student= require('../models/student');
const mongoose= require('mongoose');
const { request } = require('../../app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const axios = require('axios')

router.get('/current', (req,res,next)=>{

    const API_KEY = 'SPCBTAYD6UU1R0MU'; // replace with your own API key from Alpha Vantage
    const SYMBOL = 'IBM';
    
    const url = `https://api.twelvedata.com/price?symbol=IBM&apikey=759d05c0de694a42977fb5be514be76d`;
      
    setInterval(() => {
      
       // Increment post tracker
       console.log('Wait for 15 second...')
      
       // Make GET Request on every 2 second
       axios.get(url)
      
          // Print data
          .then(response => {
             //res.json(response.data);
             console.log(response.data)
          })
      
          // Print error message if occur
          .catch(error => console.log(
                'Error to fetch data\n'))
    }, 15000)
   })




   
router.get('/buy', (req,res,next)=>{
   let price = 100
   console.log(req.body)
   Student.find({name: req.body.name})
   .exec()
   .then(user =>{
     console.log(user[0].amount);
     if (user[0].amount < price * req.body.quantity )
     {
         console.log("Cant buy inssuficient funds");
     }
     else
     {

      console.log("sufficient funds");
      
      Student.updateOne({ name: req.body.name }, { $set: { amount: user[0].amount - price * req.body.quantity , IBM: req.body.quantity } })
      .exec()
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.error(err);
      });




     }
       })
       .catch(err=>{
         res.status(500).json({
             err: "I failed here 1"
         })
     })
 console.log('buy')

 
})

router.get('/sell', (req,res,next)=>{

   let price = 100

   console.log(req.body)
   Student.find({name: req.body.name})
   .exec()
   .then(user =>{
     console.log(user[0].IBM);
     if (user[0].IBM < req.body.IBM )
     {
         console.log("dont have enough shares to sell");
     }
     else
     {

      console.log("sufficient shares");
      Student.updateOne({ name: req.body.name }, { $set: { amount: user[0].amount + price * req.body.IBM , IBM: user[0].IBM-req.body.IBM } })
      .exec()
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.error(err);
      });




     }
       })
       .catch(err=>{
         res.status(500).json({
             err: "I failed here 1"
         })
     })
 console.log('Sell')







})



router.get('/rank', (req,res,next)=>{ 
  let price = 100


})


router.get('/networth', (req,res,next)=>{ 

})

   



   module.exports = router;