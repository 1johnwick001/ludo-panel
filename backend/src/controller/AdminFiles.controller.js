import AddGame from "../models/AddGame.models.js";
import path from "path"


const uploadFile = async(req,res) => {
    try {
        const {gameName, gameType} = req.body;

        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const gamePhoto = req.file ? req.file.filename:null;

        // // Construct the path to the uploaded file
        // const gamePhotoPath = path.join(req.file.filename);

        const GameData = new AddGame({
            gameName,
            gameType,
            gamePhoto,
        });

        const savedGame = await GameData.save();

        return res.status(200).json({
            code:200,
            status:true,
            message: 'File uploaded and game data saved successfully', 
        
            data:savedGame
        });
  

    } catch (error) {
            console.error(error);
            return res.status(500).json({ 
            code:500,
            status:false,
            message: 'Error uploading file',
            data:{}
        });
    }
}

const getGameList = async(req,res) => {
    try {
        const gameList = await AddGame.find();
        return res.status(200).json({
            code:200,
            status:true,
            message:"Game list feched successfully",
            data:gameList
        })
        
    } catch (error) {
        console.error('Error fetching userLIst', error);
        res.status(500).json({ 
            code:500,
            status:false,    
            message: "Internal Server Error",
            data:{} 
        })
    }
}

//fetching list based on id
const getgameListById = async(req,res) => {
    try {
        const id = req.params.id;
         // Use Mongoose findById method to fetch the game by ID
        const game = await AddGame.findById(id);

        if (!game) {
            return res.status(404).json({
                code:404,
                status: false,
                message: "No game found with the provided ID",
                data: {}
            })
        }

        // If game is found, return it in the response
        res.status(200).json({
            code: 200,
            status: true,
            message: "Game data successfully fetched",
            data: game
        });

      
    } catch (error) {
        console.error("Error fetching game data by ID:", error);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Error while getting game data by ID",
            data: {}
        })
    } 
}

const updateGame = async(req,res) => {
    try {
        const {id} = req.params
        const {gameName, gameType} = req.body;

        // Check if a new file is uploaded
        if (req.file) {
        // Handle new file upload
        const gamePhoto = req.file.filename;
        // Update game with new image
        await AddGame.findByIdAndUpdate(id, { gameName, gameType, gamePhoto });
        } else {
            // No new file uploaded, keep the existing image
            // Update game without modifying the image field
            await AddGame.findByIdAndUpdate(id, { gameName, gameType });
        }

        res.status(200).json({
            code:200,
            status:true,
            message:"Game List updated successfully"
        })

    } catch (error) {
        console.error(error);
    res.status(500).json({ 
        code:500,
        status:false,
        message: 'Server error',
        data:{}
    });
    }
}

const deleteGame = async(req,res) => {
    const gameId = req.params.id;
    try {
        //find the game by its id and remove it from the database
        await AddGame.findByIdAndDelete(gameId);
        res.status(200).json({
            code:200,
            status:true,
            message:"Game Deleted Successfully",
            
        })
    } catch (error) {
        console.error('Error deleing game:', error);
    res.status(500).json({ 
        code:500,
        status:false,
        message: "Internal Server Error" })
    }
}

export {uploadFile,getGameList,getgameListById,updateGame,deleteGame}