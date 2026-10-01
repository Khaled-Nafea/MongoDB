import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);

const db = client.db('booksDB');

export const connectDB = async () => {
    try {
        await client.connect();
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
    }
};

export default db;

