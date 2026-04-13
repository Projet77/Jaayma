const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testConnection = async () => {
    try {
        console.log('Tentative de connexion à :', process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jaayma_db');
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jaayma_db', {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`✅ MongoDB Connecté: ${conn.connection.host}`);
        process.exit(0);
    } catch (error) {
        console.error(`❌ Erreur de connexion: ${error.message}`);
        process.exit(1);
    }
};

testConnection();
