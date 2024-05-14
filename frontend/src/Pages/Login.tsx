import React, { useState } from 'react'
import "../assets/css/bootstrap.css"
import "../assets/css/registration.css"
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL from '../config/Config'


function Login() {

    const navigate = useNavigate()

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true) // Set loading to true when form is submitted

        try {
            const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
                email: userId,
                password: password
            })
            console.log("response of form: ", response.data);
            setUserId('');
            setPassword('');
            localStorage.setItem("is_Admin_loggedIn", true.toString());
            localStorage.setItem("Admin_Email", userId);

            if (response?.data?.data.is_Admin_loggedIn === true) {
                alert(`Admin ${userId} logged in successfully`)
                navigate("/AdminHome")
            }


        } catch (error) {
            console.log("error while submiing details", error);
        } finally {
            setLoading(false) //Reset loading state after login attempt
        }

    }


    return (

        <div className="main_page">
            <div className="login_page">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8 p-0" >
                            <div className="left_img_track">
                                <div className="bg_login ">
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
                                        <h3>Welcome </h3>
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
                                                {loading ? (
                                                    <button className="sub_in_btn w-100" disabled>
                                                        Loading...
                                                    </button>
                                                ) : (
                                                    <input type="submit" value="Sign In" className="sub_in_btn w-100" />
                                                )}

                                                <p className="sing_up_tals text-center">
                                                    <h4>Don't have an account? <Link to="/signUp">Sign up </Link></h4>
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

    )
}

export default Login