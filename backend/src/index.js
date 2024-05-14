import express from "express";
import dotenv from "dotenv"
import connectDB from "./db/db.connection.js";
import cors from "cors"
import cookieParser from "cookie-parser"

import adminRoute from "./routes/AdminRoutes.js"
import userRoute from "./routes/UserRoutes.js"

dotenv.config({
    path:'./.env'
})

connectDB()

const app = express();

//to parse incoming request bodies with JSON payloads.
app.use(express.json());
app.use(cors());
app.use(cookieParser())
app.use(express.static('uploads'));

//CONFIGURING ROUTES 
app.use(adminRoute) //routes for admin side
app.use(userRoute) //routes for user
 

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(port , () => {
    console.log(`server listening on ${port}`);
})