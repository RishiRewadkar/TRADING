const express = require('express');
const router = express.Router();
const Student= require('../models/student');
const mongoose= require('mongoose');
const { request } = require('../../app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const axios = require('axios')




router.get('/current',checkAuth, (req,res,next)=>{

    const API_KEY = 'SPCBTAYD6UU1R0MU'; // replace with your own API key from Alpha Vantage
    const SYMBOL = 'IBM';
    
    const url = `https://api.twelvedata.com/price?symbol=IBM&apikey=759d05c0de694a42977fb5be514be76d`;
      
  
      
       // Increment post tracker
       console.log('Wait for 15 second...')
      
       // Make GET Request on every 2 second
       axios.get(url)
      
          // Print data
          .then(response => {
             //res.json(response.data);
             console.log(response.data)
             res.send(response.data.price)
          })
      
          // Print error message if occur
          .catch(error => console.log(
                'Error to fetch data\n'))
    
   })




   
router.post('/buy',checkAuth, (req,res,next)=>{
  const API_KEY = 'SPCBTAYD6UU1R0MU'; // replace with your own API key from Alpha Vantage
  const SYMBOL = 'IBM';
  
  const url = `https://api.twelvedata.com/price?symbol=IBM&apikey=759d05c0de694a42977fb5be514be76d`;
  let price = 100
   quantity = parseInt(req.body.quantity);

  axios.get(url)
    .then(response => {
        console.log("IN here now  BUY CALL")
        console.log(response.data);
        console.log(req.body)
        price = response.data.price
        token = req.cookies.token
        decoded = jwt.verify(token, 'This is secret key');
        console.log(decoded.name)
        Student.findOne({name: decoded.name})
        .exec()
        .then(user =>{
          console.log(user.amount);
          if (user.amount < price * quantity )
          {
              console.log("Cant execute buy order funds");
              res.send("Cant execute buy order funds")
          }
          else
          {
     
           console.log("sufficient funds");
           
           Student.updateOne({ name: decoded.name }, { $set: { amount: user.amount - price * quantity , IBM: user.IBM + quantity } })
           .exec()
           .then(result => {
             console.log(result);
             res.send("Executed Buy Order")
           })
           .catch(err => {
             console.error(err);
           });
     
     
          }
            })
            .catch(err=>{
              res.status(500).json({
                  err: "I failed here"
              })
          })

 
    })
    .catch(error => {
        console.log('Error fetching data:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    });


  
 console.log('buy Is Here ')

 
})

router.post('/sell',checkAuth, (req,res,next)=>{
  console.log("I reached the route")
  const API_KEY = 'SPCBTAYD6UU1R0MU'; // replace with your own API key from Alpha Vantage
  const SYMBOL = 'IBM';
  
  const url = `https://api.twelvedata.com/price?symbol=IBM&apikey=759d05c0de694a42977fb5be514be76d`;
  let Sellingprice = 100
  console.log(req.body)
  quantity = parseInt(req.body.quantity);
  axios.get(url)
    .then(response => {
        console.log("IN here now ")
        console.log(response.data);
        Sellingprice = response.data.price
        token = req.cookies.token
        decoded = jwt.verify(token, 'This is secret key');
        Student.findOne({name: decoded.name}).exec()
   .then(user =>{
    
     console.log(user.IBM);
     if (user.IBM < quantity )
     {
         console.log("dont have enough shares to sell");
         res.send("Cant Place sell order insufficient Stocks")
     }
     else
     {

      console.log("sufficient shares");
      Student.updateOne({ name: decoded.name }, { $set: { amount: user.amount + Sellingprice * quantity , IBM: user.IBM - quantity } })
      .exec()
      .then(result => {
        console.log(result);
        res.send("Executed Sell Order")
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



router.get('/rank',checkAuth, (req, res, next) => {
  const API_KEY = 'SPCBTAYD6UU1R0MU'; // replace with your own API key from Alpha Vantage
  const SYMBOL = 'IBM';

  const url = `https://api.twelvedata.com/price?symbol=IBM&apikey=759d05c0de694a42977fb5be514be76d`;
  axios.get(url)
    .then(response => {
      console.log("IN here now RANK ");
      console.log(response.data);
      const stockPrice = parseFloat(response.data.price); // Convert stockPrice to a numeric value

      Student.aggregate([
        {
          $addFields: {
            totalStockAndAssets: {
              $sum: [
                "$amount", // Add the amount field
                { $multiply: [{ $toDouble: "$IBM" }, stockPrice] } // Convert IBM to a numeric value and multiply by stockPrice
              ]
            }
          }
        },
        {
          $sort: {
            totalStockAndAssets: -1
          }
        }
      ])
        .exec()
        .then(user => {

          console.log(user);

          res.send(user); 
 
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({
            err: "An error occurred"
          });
        });
    })
    .catch(error => {
      console.log('Error fetching data:', error.message);
      res.status(500).json({ error: 'Failed to fetch data' });
    });
});




router.get('/portfolio',checkAuth, (req,res,next)=>{ 
  price = 100
  token = req.cookies.token
  decoded = jwt.verify(token, 'This is secret key');
  Student.findOne({name: decoded.name})
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

   module.exports = router;