const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    console.log("got token")
    console.log(req.cookies.token)
    try{
        const token = req.cookies.token
        console.log(token);
        const verify = jwt.verify(token,'This is secret key');
        console.log(verify);
        next();
    }
    catch(error)
    {
        return res.status(401).json({
            msg: 'INVALID TOKEN'
        })
    }

}