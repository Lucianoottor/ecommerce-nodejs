const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class UserController{
    constructor(UserService){
        this.userService = UserService;
    }

    async createUser(req, res){
        const { email, birthDate, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required', statusCode: 400 });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: 'Invalid email format', statusCode: 400 });
        }

        try {
            const newUser = await this.userService.create(email, birthDate, password);
            res.status(201).json({ data: newUser });
        } catch(error) {
            res.status(500).json({ error: 'Error creating user', statusCode: 500 });
        }
    }

    async findAllUsers(req, res){
        try {
            const allUsers = await this.userService.findAll();
            res.status(200).json({ data: allUsers });
        } catch(error) {
            res.status(500).json({ error: 'Error fetching users', statusCode: 500 });
        }
    }

    async findUserById(req, res){
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID', statusCode: 400 });
        }
        try {
            const user = await this.userService.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found', statusCode: 404 });
            }
            res.status(200).json({ data: user });
        } catch(error) {
            res.status(500).json({ error: 'Error fetching user by ID', statusCode: 500 });
        }
    }

    async login(req, res){
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required', statusCode: 400 });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: 'Invalid email format', statusCode: 400 });
        }

        try {
            const user = await this.userService.login(email, password);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials', statusCode: 401 });
            }
            res.status(200).json({ data: user });
        } catch(error) {
            res.status(500).json({ error: 'Error during login', statusCode: 500 });
        }
    }
}

module.exports = UserController;
