const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/jaayma_db';

const testConnection = async () => {
    try {
        console.log('Attempting to connect to:', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('✅ Success! Connected to MongoDB.');

        // Define a temp schema to test write
        const TestSchema = new mongoose.Schema({ name: String });
        const TestModel = mongoose.model('TestConnection', TestSchema);

        console.log('Attempting to write a test document...');
        await TestModel.create({ name: 'Connection Verified' });
        console.log('✅ Success! Document written. Database should now be visible.');

        console.log('Check Compass for "jaayma_db" > "testconnections".');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        process.exit(1);
    }
};

testConnection();
