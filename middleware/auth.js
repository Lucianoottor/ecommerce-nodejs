const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
const secret = process.env.JWT_SECRET;

async function generateToken(user){
    const id = user.userId;
    const email = user.email;
    const token = jwt.sign({id,email},secret, {expiresIn:'1h'});
    return token;
}

async function verifyToken(req, res, next){
    const authheader =req.headers['authorization'];
    if(!authheader){
        return res.status(401).json({Message:'Token não informado'});
    }
    const token = authheader.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Token não informado'});
    }
    jwt.verify(token, secret,(err, decoded)=>{
        if (err){
            return res.status(401).json({Message:'Token inválido'});
        }
        req.user = decoded;
        next();
    });
}

module.exports = {generateToken, verifyToken} ;














