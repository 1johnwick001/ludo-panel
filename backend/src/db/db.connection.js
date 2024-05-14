import mongoose, { mongo } from "mongoose"
import dotenv from "dotenv"

dotenv.config({
    path:'./.env'
})

const MONGO_URL = process.env.MONGO_URL;


//connection for connecting backend to ludo database in mongoDB

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${MONGO_URL}`)
        console.log(`\n MONGODB connected successfully !@!@!@!@!`);
    } catch (error) {
        console.log("mongoDB connection error, error while connecting DB to url",error);
    }
}

export default connectDB