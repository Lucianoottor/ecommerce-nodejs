const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
const secret = process.env.JWT_SECRET;

async function generateToken(user) {
    const id = user.id;
    const email = user.email;
    const role = user.role;
    const token = jwt.sign({ id, email, role }, secret, { expiresIn: '1h' });
    return token;
}

async function verifyToken(req, res, next) {
    const authheader = req.headers['authorization'];
    if (!authheader) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    const token = authheader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

module.exports = { generateToken, verifyToken };
