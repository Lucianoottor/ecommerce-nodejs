const auth = require('../middleware/auth');

const db = require('../models');

class UserService {
    constructor(UserModel) {
        this.User = UserModel;
    }

    async create(email, data_nasc, password) {
        try {
            const newUser = await this.User.create({ email, data_nasc, password });
            return newUser || null;
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            return await this.User.findAll({ attributes: { exclude: ['password'] } }) || null;
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            return await this.User.findByPk(id, { attributes: { exclude: ['password'] } }) || null;
        } catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            const user = await this.User.findOne({ where: { email } });
            if (!user) return null;

            const isValid = await user.comparePassword(password);
            if (!isValid) return null;

            const token = await auth.generateToken(user);
            user.dataValues.Token = token;
            user.dataValues.password = undefined;
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;
