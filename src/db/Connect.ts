import mongoose from "mongoose";

type dbConnection = {
    isConnected ?: number,
}

const connection : dbConnection  = {};

async function dbConnect(): Promise<void>
{
    if (connection.isConnected) {
        console.log('Database connection already exists !!!');
        return;        
    }
    try {
        const db = await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_DB_URL || '', {})
        connection.isConnected = db.connections[0].readyState;
        console.log('Whoo hoo !!! Database connected successfully');
    } catch (error) {
        console.log('Oh no ! Database connection failed.');
        console.log('Error occurred : ', error);
        process.exit(1);
    }
}
export default dbConnect;