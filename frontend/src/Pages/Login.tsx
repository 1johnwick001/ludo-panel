import React, { useState } from 'react';
import "../assets/css/bootstrap.css";
import "../assets/css/registration.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/Config';
import { toast, ToastContainer } from 'react-toastify';

function Login() {
    const navigate = useNavigate();

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const loadingToastId = toast.loading("Logging in..."); // Show loading toast

        try {
            const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
                email: userId,
                password: password
            });
            setUserId('');
            setPassword('');
            console.log("response of form: ", response.data);
            localStorage.setItem("is_Admin_loggedIn", true.toString());
            localStorage.setItem("Admin_Email", userId);

            if (response?.data?.data.is_Admin_loggedIn === true) {
                toast.update(loadingToastId, {
                    render: `Admin ${userId} logged in successfully`,
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                    position: "top-center"
                });
                navigate("/AdminHome");
            }

        } catch (error) {
            console.log("error while submitting details", error);
            // Display error toast for network or server errors
            toast.update(loadingToastId, {
                render: 'Incorrect email or password. Please try again later.',
                type: "error",
                isLoading: false,
                autoClose: 3000,
                position: "top-center"
            });
        }
    };

    return (
        <div className="main_page">
            <ToastContainer />
            <div className="login_page">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8 p-0">
                            <div className="left_img_track">
                                <div className="bg_login">
                                    <div className="heding_login">
                                        {/* <h1>SIGN IN</h1> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col p-0" style={{ position: 'relative', top: '-10%', transform: 'translateY(10%)' }}>
                            <div className="register-right">
                                <div className="working_login">
                                    <div className="logo_login">
                                        {/* <img src={logo} alt="" id="logo-img" /> */}
                                        <h3>Welcome</h3>
                                        <h4>Welcome!!! Please enter your details.</h4>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="registerform">
                                            <div className="form-group col-md-12">
                                                <input type="email" className="form-control" placeholder="Enter your email..." required value={userId} onChange={(e) => setUserId(e.target.value)} />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <input type="password" className="form-control" placeholder="Enter password..." required value={password} onChange={(e) => setPassword(e.target.value)} />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <input type="submit" value="Sign In" className="sub_in_btn w-100" />
                                                <p className="sing_up_tals text-center">
                                                    <h4>Don't have an account? <Link to="/signUp">Sign up</Link></h4>
                                                </p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
