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
  const API_KEY = 'SPCBTAYD6UU1R0MU'; // replace with your own API key from Alpha Vantage
  const SYMBOL = 'IBM';
  
  const url = `https://api.twelvedata.com/price?symbol=IBM&apikey=759d05c0de694a42977fb5be514be76d`;
  let price = 100


  axios.get(url)
    .then(response => {
        console.log("IN here now ")
        console.log(response.data);
        price = response.data.price
        Student.findOne({name: req.body.name})
        .exec()
        .then(user =>{
          console.log(user.amount);
          if (user.amount < price * req.body.quantity )
          {
              console.log("Cant buy inssuficient funds");
              res.send("Cant Buy Insifficient Funds")
          }
          else
          {
     
           console.log("sufficient funds");
           
           Student.updateOne({ name: req.body.name }, { $set: { amount: user.amount - price * req.body.quantity , IBM: user.IBM + req.body.quantity } })
           .exec()
           .then(result => {
             console.log(result);
             res.send("Bought IBM Shares")
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

 
    })
    .catch(error => {
        console.log('Error fetching data:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    });



   console.log(req.body)
  
 console.log('buy Is Here ')

 
})

router.get('/sell', (req,res,next)=>{
  const API_KEY = 'SPCBTAYD6UU1R0MU'; // replace with your own API key from Alpha Vantage
  const SYMBOL = 'IBM';
  
  const url = `https://api.twelvedata.com/price?symbol=IBM&apikey=759d05c0de694a42977fb5be514be76d`;
  let Sellingprice = 100


  axios.get(url)
    .then(response => {
        console.log("IN here now ")
        console.log(response.data);
        Sellingprice = response.data.price
        Student.findOne({name: req.body.name}).exec()
   .then(user =>{
     console.log(user.IBM);
     if (user.IBM < req.body.quantity )
     {
         console.log("dont have enough shares to sell");
         res.send("Cant Place sell order insufficient Shares")
     }
     else
     {

      console.log("sufficient shares");
      Student.updateOne({ name: req.body.name }, { $set: { amount: user.amount + Sellingprice * req.body.quantity , IBM: user.IBM-req.body.quantity } })
      .exec()
      .then(result => {
        console.log(result);
        res.send("Placed Sell Order")
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


    })
    .catch(error => {
        console.log('Error fetching data:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    });


})



router.get('/rank', (req,res,next)=>{ 

  const API_KEY = 'SPCBTAYD6UU1R0MU'; // replace with your own API key from Alpha Vantage
  const SYMBOL = 'IBM';
  
  const url = `https://api.twelvedata.com/price?symbol=IBM&apikey=759d05c0de694a42977fb5be514be76d`;
  axios.get(url)
  .then(response => {
      console.log("IN here now ")
      console.log(response.data);
      const stockPrice = response.data.price;

    Student.aggregate([
        {
          $addFields: {
            StockPrice: stockPrice,
            totalStockAndAssets: { $sum: ["$amount", { $multiply : ["$IBM" , "$StockPrice"] } ] }
          }
        },
      {
        $sort: {
          totalStockAndAssets: 1
        }
      }
    ]
  )
  .exec()
  .then(user =>{
    console.log(user);
    res.send(user)
      })
      .catch(err=>{
        res.status(500).json({
            err: "I failed here 1"
        })
    })
  })
.catch(error => {
    console.log('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
})


})


router.get('/networth', (req,res,next)=>{ 
  price = 100
  console.log(req.body)
  Student.findOne({name: req.body.name})
  .exec()
  .then(user =>{
    console.log(user);
    
    
    
      })
      .catch(err=>{
        res.status(500).json({
            err: "I failed here 1"
        })
    })


})

   module.exports = router;