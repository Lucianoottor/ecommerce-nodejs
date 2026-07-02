var express = require('express');
var router = express.Router();
const rateLimit = require('express-rate-limit');
const auth = require('../../middleware/auth');
const rbacMiddleware = require('../../middleware/rbac');

const db = require('../../models');

const UserService = require('../../services/userService');
const UserController = require('../../controllers/userController');

const userService = new UserService(db.User);
const userController = new UserController(userService);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts, try again later', statusCode: 429 },
});

router.post('/login', authLimiter, async (req, res) => {
  userController.login(req, res);
});

router.post('/register', authLimiter, async (req, res) => {
  userController.createUser(req, res);
});

router.get('/allusers', auth.verifyToken, rbacMiddleware.checkPermission('read_user'), async (req, res) => {
  userController.findAllUsers(req, res);
});

router.get('/:id', auth.verifyToken, rbacMiddleware.checkPermission('read_user'), async (req, res) => {
  userController.findUserById(req, res);
});

module.exports = router;
