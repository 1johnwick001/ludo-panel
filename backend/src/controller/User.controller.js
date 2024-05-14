import User from "../models/User.models.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import sendOTP from "../utils/SendOtp.js";


const saltRounds = 10

//controller for registering client
const registerUser = async(req,res) => {
    try {
        const { 
            username,
            email,
            phoneNumber,
            countryCode,
            password,
            conf_password } = req.body

            //hashing password using bcrypt
            const hashPassword = await bcrypt.hash(password,saltRounds);

            //create new user instance
            const newUser = new User({
                username,
                email,
                phoneNumber,
                countryCode,
                password: hashPassword, //store the hashed password 
                conf_password: hashPassword //store the hashed password

            })

            //if email alredy exists than:
            const existingEmail = await User.findOne({ email })

            if (existingEmail) {
                return res.status(209).json({
                    code:209,
                    status:false,
                    message: "Email alraedy registered"
                })
            }
            else if (password !== conf_password) {
                return res.status(209).json({
                    code:209,
                    status:false,
                    message: "Password and confirm password do not match!!!!"
                })
            }

            const mobileLength = countryCode.toString().length + phoneNumber.toString().length;

            if (mobileLength < 10 || mobileLength > 13) {
                return res.status(209).json({ 
                    code:209,
                    status:false,
                    message: "mobile number must be valid" })
            }

            else if (password.length < 8 && conf_password.length < 8) {
                return res.status(209).json({
                    code:209,
                    status:false,
                    message: "Password and confirm password should a least be 6 characters long"
                })
            }

        //save the new user in DB
        await newUser.save()
        
        return res.status(201).json({
            code:201,
            status:true,
            message: "user registered successfully",
            data : newUser
            
        })

    } catch (error) {
        console.log("Error registering client: ", error);
        return res.satus(500).json({
            code:500,
            status:false,
            message: "Error while regisering user",
            data:{}
        })
    }
}

const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body;

        //find client by id
        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({
                code:404,
                status:false,
                message:"user with he provided email was not found"
            })
        }

        //compare password with the db one
        const matchPassword = await bcrypt.compare(password, user.password)

        if (!matchPassword) {
            return res.status(404).json({
                message: "Password did not match,YO!!!"
            })
        }

        const payload = {
            userId: user._id,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
        console.log(token);
        //save client in db
        await user.save();

        return res.status(200).json({
            code:200,
            status:true,
            message: "Client logggedIn Successfully",
            data:token //GENERATED JWT TOKEN
        })

    } catch (error) {
        console.error("error while logging client:", error);
        return res.status(500).json({
            code:500,
            status:false,
            message: "server side issue while logging client"
        })
    }
} 

const forgetPasswordOtp = async (req,res) => {
    try {
        const { email } = req.body;

        //generate otp
        const forgetPassOtp = await sendOTP(email);
        // Update the user's document with the OTP
        const user = await User.findOneAndUpdate({ email }, {
            $set: {
                forgetPassOtp
            }
        }, { new: true });

        console.log("client", user);

        if (!user) {
            return res.status(404).json({
                code:404,
                status:false,
                message: "User email not found"
            })
        }

        return res.status(201).json({
            code:201,
            status:true,
            message: "OTP sent successfully on users email",
            data: {

                forgetPassOtp
            }
        })

        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            code:500,
            status:false,
            message: "server side error while sending OTP",
            data:{}
        })
    }
}

const otpVerify = async (req,res) => {
    try {
        const { email, otp } = req.body;

        //find the client by email and retrieve the stored otp
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                code:404,
                status:false,
                message: "user not found",
                data:{}
         })
        }

        const storedOTP = user.forgetPassOtp;

        //check if the otp matches and its valid
        if (otp === storedOTP) {

            user.forgetPassOtp = undefined;

            await user.save();

            return res.status(200).json({ 
                code:200,
                status:true,
                message: "OTP verified successfully",
                
            })
        } else {
            return res.status(401).json({
                message: "Invalid OTP"
            })
        }


    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({
            code:500,
            status:false,
            message: "Server error while verifying OTP",
        data:{}
     })
    }
}

const passwordUpdate = async (req,res) => {
    try {
        const {email, password, conf_password} = req.body;

        const user = await User.findOneAndUpdate({email},{password, conf_password},{new:true});

        if (!user) {
            return res.status(400).json({
                code:400,
                status:false,
                message:"user not found"
            })
        }

        if (password !== conf_password) {
            return res.status(209).json({
                code:209,
                status:false,
                message: "Passwor do not match"
            })
        }

        //Hash the new password
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        //update the user's password
        user.password = hashedPassword;

         //save the updated user in db
         await user.save();
         return res.status(201).json({
            code:201,
            status:true,
             message: "Password reset successfully",
             data: user.password
         })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code:500,
            status:false,
            message: "Server side error while verifying otp",
            data:{}
        })
    }
}

const logoutUser = async (req,res) => {
    try {
        //no user data is needed from request body cz of stateless login(JWT)
        return res.status(200).json({
            code:200,
            status:true,
            message:"Client logged out successfully"
        })
    } catch (error) {
        console.error("error while logging out user",error);
        return res.status(500).json({
            code:500,
            status:false,
            message:"server side issue while logging out ",
            data:{}
        })
    }
}

const deleteUser = async(req,res) => {
    const _id = req.params._id;
    try {

        const delete1 =   await User.findByIdAndDelete(_id);

        res.status(200).json({
            code:200,
            status:true,
            message:"user deleted successfully",
            data:delete1
        })

    } catch (error) {
        console.error("error deleting user",error);
        res.status(500).json({
            code:500,
            status:false,
            message:"Internal server error while deleting user"
        }) 
    }
}

const getUserList = async (req,res) => {
    try {
        const data = await User.find().select('username email countryCode phoneNumber')

        return res.status(200).json({
            code:200,
            status:true,
            message:"user list",
            data:data
        })
    } catch (error) {
        console.error("error while getting profiles of client: ", error);
        return res.satus(400).json({
            code:400,
            status:false,
            message: "Server side error while geting profile for client",
            data:{}
        })
    }
}




export {registerUser,loginUser,getUserList,logoutUser,deleteUser,forgetPasswordOtp,otpVerify,passwordUpdate}