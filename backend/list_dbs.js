const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/jaayma_db';

const listDatabases = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const result = await admin.listDatabases();
        console.log('Databases found:', result.databases);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listDatabases();
