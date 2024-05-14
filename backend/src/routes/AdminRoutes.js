import express from "express";
import multer from "multer"
import path from "path";
import {registerAdmin, loginAdmin, logoutAdmin, listAdmin, listAdminDelete } from "../controller/Admin.controller.js";
import { deleteGame, getGameList, getgameListById, updateGame, uploadFile } from "../controller/AdminFiles.controller.js";



const router = express.Router()

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/photos")
    },filename:(req,file,cb)=>{
        cb(null,file.fieldname + "-" + Date.now() + path.extname (file.originalname))
    }
})

const upload = multer({
    storage:storage
})




//route for registering admin
router.post("/api/admin/register",registerAdmin)
//routee for loggin in admin
router.post("/api/admin/login",loginAdmin)
//router for loging out admin
router.post("/api/admin/logout",logoutAdmin)
//route for fetching list
router.get("/api/admin/adminlist",listAdmin)
//route for deleting list
router.delete("/api/admin/deletelist/:id",listAdminDelete);

//<!-------------------Files routing/gamelist /type routing---------------!>
router.post("/api/admin/upload",upload.single('gamePhoto'),uploadFile)
//for fetching game list
router.get("/api/admin/gameList",getGameList)
//getting particular game data using its id 
router.get("/api/admin/listById/:id",getgameListById)
//updating ain edit page
router.put("/api/admin/updategame/:id",upload.single("gamePhoto"),updateGame)
//route for deleting
router.delete("/api/admin/deletegame/:id",deleteGame)

export default router