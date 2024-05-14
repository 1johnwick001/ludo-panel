import mongoose from "mongoose"


const BetSchema = new mongoose.Schema({

    userId : {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User',
        required: true,
    },
    gameType:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true
    },
    transactionId:{
        type:String,
        required:true,
        unique:true
    }

},{timestamps:true})

const AddBet = mongoose.model("AddBet",BetSchema);

export default AddBet