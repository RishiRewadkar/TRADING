const express = require('express');
const router = express.Router();
const Student= require('../models/student');
const mongoose= require('mongoose');
const { request } = require('../../app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

router.get('/',checkAuth, (req,res,next)=>{
 Student.find().then(result=>{
    res.status(200).json({
        studentsData:result
    });
 })
 .catch(err=>
    {
    console.log(err);
    res.status(500).json({
        error:err
    })
 });
})


router.post('/login', (req,res,next)=>{
    Student.find({name: req.body.name})
    .exec()
    .then(user =>{
        if(user.length < 1)
        {
            return res.status(401).json({
                msg: 'student name does not exist'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(!result)
            {
                return res.status(401).json({
                    msg: 'password matching fail'
                })
            }
            if(result)
            {
                const token = jwt.sign({
                    name: user[0].name,
                    email: user[0].email

                }, 'This is secret key',
                {
                    expiresIn: '6hr'
                }
                );
                res.status(200).json({
                    name: user[0].name,
                    toekn: token
                })
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            err: err
        })
    })
})



router.post('/signup',(req,res,next)=>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err)
        {
            return res.status(500).json({
                error:err
            })
        }
        else
        {
            const student = new Student({
                _id: new mongoose.Types.ObjectId,
                name:req.body.name,
                email:req.body.email ,
                amount:1000 , 
                password: hash, 
                IBM: 0
             })


             student.save().then(result=>{
                console.log(result);
                res.status(200).json({
                    newStudent: result
                })
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error:err
                });
            })

        }
    })

})

module.exports = router;
