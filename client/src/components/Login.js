import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import travel from "../images/travel-logo.png";
import axios from "axios";
import swal from 'sweetalert';

export default class Login extends Component {

    authenticateUser = () => {
        var data =
        {
            username: document.getElementById("login-username").value,
            password: document.getElementById("login-password").value
        }

        axios.post("http://localhost:3001/auth/login", data).then((response) => {
            if(response.data.error){
                swal({
                    title: "Failed!",
                    text: response.data.error,
                    icon: "error",
                    timer: 2000,
                    button: false
                });
            }
            else{
                sessionStorage.setItem("accessToken", response.data);
                this.props.navigate("/home");
            }
        })
    }

    render() {
        return (
            <div className='Login'>
                <div className="lr-logo">
                    <img src={travel} alt="LetsTravel" />
                </div>

                <input className='lr-input' id="login-username" name="username" type="text" required="required" placeholder="Username" />
                <input className='lr-input' id="login-password" name="password" type="password" required="required" placeholder="Password" />

                <div className="loginpage-buttons">
                    <button type="button" className="btn btn-primary btn-lg btn-block" onClick={this.authenticateUser}>
                        Login
                    </button>
                    <h4 className="hr-lines"> OR </h4>
                    <Link to="/register" type="button" className="btn btn-secondary btn-lg btn-block">Sign Up</Link>
                </div>
            </div>
        )
    }
}

export function NavigateLogin(props){
    const navigate = useNavigate();
    return (<Login navigate={navigate}></Login>)
}
