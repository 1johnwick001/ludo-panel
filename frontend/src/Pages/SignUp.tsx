import axios from 'axios'
import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import API_BASE_URL from '../config/Config'
import { toast } from 'react-toastify'

function SignUp() {

  const navigate = useNavigate()

    const [username,setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password,setPasssword] = useState('')

    const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault()

        if (!password || password.length < 8) {
          toast.error('Password is required and must be at least 8 characters long.');
          return; // Early return if validation fails
        }

        await axios.post(`${API_BASE_URL}/api/admin/register`,{username,email,password})
        .then((response) => {
          console.log(response);
          
            // Handle success
          if (response.status === 201) {
            console.log("form response: ",response.data);
            setUserName('')
            setEmail('')
            setPasssword('')
            toast.success("You have been sucessfully registered!!",{ position: "top-center"})
            navigate('/AdminHome')
            
          }
          else if (response.status === 209) {
            // Handle USERNAME OR EMAIL ALREADY EXISTS error
            toast.warn('Username or email already exists',{ position: "top-center"});
        } else {
            // Handle other errors
            toast.error('An error occurred while registering. Please try again later.',{ position: "top-center"});
        }
        })
        .catch(error => {
          // Handle network errors or other exceptions
          console.error('Error:', error);
          toast.error('An network error occurred while registering. Please try again later.',{ position: "top-center"});
      });
    }

  return (
    <div className="login_page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 p-0" >
            <div className="left_img_track" style={{height:'1079.49px',width:'',backgroundSize:'cover',backgroundPosition:'center'}}>
              <div className="bg_login">
                <div className="heding_login">
                  <h1>WELCOME </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md p-0" style={{position:'relative'}}>
            <div className="register-right">
              <div className="working_login">
                <div className="logo_login">
                  <h3>Welcome </h3>
                  <h4>Welcome!!! Please enter your details.</h4>
                </div>
                  <form onSubmit={handleSubmit}>
                      <div className="registerform">
                          <div className="form-group col-md-12">
                              <input type="text" className="form-control" placeholder="Enter your UserName..." required value={username} onChange={(e) => setUserName(e.target.value)} /> 
                          </div>
                          <div className="form-group col-md-12">
                              <input type="email" className="form-control" placeholder="Enter your email..." required value={email} onChange={(e) => setEmail(e.target.value)} /> 
                          </div>
                          <div className="form-group col-md-12">
                              <input type="password" className="form-control" placeholder="Enter password..." required value={password} onChange={(e) => setPasssword(e.target.value)}/>
                          </div>
                          
                          <div className="form-group col-md-12">
                              <input type="submit" defaultValue="Sign In" className="sub_in_btn w-100" />
                              <p className="sing_up_tals text-center">
                                  <h4>Have an account? <Link to ="/">Login</Link></h4>
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
  )
}

export default SignUp