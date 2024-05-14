import Admin from "../models/Admin.models.js";
import bcrypt from "bcrypt"

const saltRounds = 10

//controller for registering Admin
const registerAdmin = async(req,res) => {
    try {
        // Extract username, email, and password from the request body
        const {username, email, password} = req.body

        // Hashing  password using bcrypt
        const hashPassword = await bcrypt.hash(password,saltRounds);

        //create new admin instance 
        const newAdmin = new Admin({
            username,
            email,
            password:hashPassword
        })

        // Check if the email or username already exists in the database
        const existingUser = await Admin.findOne({
            $or:[{username},{email}]
        })

        // If a user with the same email or username already exists, return an error response
        if (existingUser) {
            return res.status(209).json({
                code:209,
                status:false,
                message:"USERNAME OR EMAIL ALREADY EXISTS!!!!",
                data:{}
            })
        }

        else if (password.length < 8) {
            return res.status(209).json({
                code:209,
                status:false,
                message:"password must be a least 8 character long",
                data:{}
            })
        }

        newAdmin.is_Admin_loggedIn = true;
        // Save the user to the database
        await newAdmin.save();

        const data = newAdmin

        return res.status(201).json({
            code:201,
            status:true,
            message:"Admin Sucessfully registered",
            data:data
        })

    } catch (error) {
        console.error("Error while registering admin",error);
        return res.status(500).json({
            status:500,
            message:"Error while registering admin",
            data:{}
        })
    }
}

const loginAdmin = async (req,res) => {
    try {
        const {email, password} = req.body;

        //find user by email
        const admin = await Admin.findOne({email});

        if (!admin) {
            return res.status(404).json({
                code:404,
                status:false,
                message:"Admin with the provided email does not exist",
                data:{}
            })
        }

        const matchedPassword = await bcrypt.compare(password,admin.password)

        if (!matchedPassword) {
            return res.status(404).json({
                code:404,
                status:false,
                message:"INCORRECT PASSWORD!!!",
                data:{}
            })
        }
        admin.is_Admin_loggedIn = true;

        //save the admin in db
        await admin.save()

        return res.status(201).json({
            code:201,
            status:true,
            message:"Admin loggedIn successfully",
            data:admin
        })

    } catch (error) {
        console.error("error while loggin in admin",error);
        return res.status(500).json({
            code:500,
            status:false,
            message:"Server Side Error while logging in Admin",
            data:{}
        })
    }
}

const logoutAdmin = async(req,res) => {
    try {
        const {email} = req.body

        //find the admin by email
        const admin = await Admin.findOne({email})

        if (!admin) {
            return res.status(404).json({
                code: 404,
                status:false,
                message: "Admin not found",
                data:{}
            });
        }

        // Update the is_Admin_loggedIn status to false
        admin.is_Admin_loggedIn = false;

        await admin.save()
        return res.status(202).json({
            code:202,
            status:true,
            message:"Admin loggedOut Sucessfully",
            is_Admin_loggedIn:admin.is_Admin_loggedIn
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            code: 500,
            status:false,
            message: "Server Side error while Loggingout admin",
            data:{}
        })
    }
}

const listAdmin = async(req,res) => {
    try {
        const list = await Admin.find().select('username email password')

        return res.status(200).json({
            code:200,
            status:true,
            message:"list fetched successfully",
            data:list
        })
    } catch (error) {
        console.error("error while geting admins list",error);
        return res.status(400).json({
            code:400,
            status:false,
            message:"Server side error while getting profile for client",
            data:{}
        })
    }
}

const listAdminDelete = async (req,res)=>{
    const adminId = req.params.id;

    try {
        //find the admin by its id and remove it from the list in real it will be removed from db
        await Admin.findByIdAndDelete(adminId);

        res.status(200).json({
            code:200,
            status:true,
            message:"Admin Deleted from list successfully!!"
        })
    } catch (error) {
        console.error("error deleting Admin from list",error);
        res.status(500).json({
            code:500,
            status:false,
            message:"Internal Server Error while deleting Admin from list",
            data:{}
        })
    }
}

export  {registerAdmin,loginAdmin,logoutAdmin,listAdmin,listAdminDelete}
