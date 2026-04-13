const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure file exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));

const readData = () => JSON.parse(fs.readFileSync(USERS_FILE));
const writeData = (data) => fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));

class UserLocal {
    constructor(data) {
        this._id = data._id || data.id || Date.now().toString();
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role || 'client';
        this.phone = data.phone;
        this.createdAt = data.createdAt || new Date();
    }

    static async findOne({ email }) {
        const users = readData();
        const user = users.find(u => u.email === email);
        return user ? new UserLocal(user) : null;
    }

    static async findById(id) {
        const users = readData();
        const user = users.find(u => u._id === id || u.id === id);
        return user ? new UserLocal(user) : null;
    }

    static async create(data) {
        const users = readData();

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const newUser = new UserLocal({
            ...data,
            password: hashedPassword,
            _id: Date.now().toString()
        });

        users.push(newUser);
        writeData(users);
        return newUser;
    }

    async matchPassword(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    }
}

module.exports = UserLocal;
