import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import travel from "../images/travel-logo-circular.png";
import profile from "../images/no-profile-pic.png";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profilePic: "",
            username: ""
        }
    }

    logOut = () => {
        sessionStorage.removeItem('accessToken'); 
        sessionStorage.clear(); 
        this.props.navigate("/")
    }

    initiateSearch = (event) => {
        event.preventDefault()
        var search = document.getElementById("search-text").value;
        if (search != "") {
            this.props.navigate("/searchResult/" + search)
        }
        else {
            swal({
                title: "Opps!",
                text: "Search box is empty",
                icon: "warning",
                timer: 5000,
                button: false,
            });
        }
    }

    async componentDidMount() {
        var ul = document.getElementById("navbar-list");
        var items = ul.getElementsByTagName("li");
        for (var i = 0; i < items.length; ++i) {
            items[i].classList.remove('active');
        }
        document.getElementById("profile-navigation").classList.remove('profile-page-active');
        if (this.props.page != 'search') {
            document.getElementById(this.props.page).classList.add('active');
            if (this.props.page == 'profile-page') {
                document.getElementById("profile-navigation").classList.add('profile-page-active');
            }
        }

        axios.post("http://localhost:3001/navbar",
            {
                accessToken: sessionStorage.getItem("accessToken")
            })
            .then((response) => {
                if (response.data.error) {
                    this.setState({
                        profilePic: profile
                    })
                }
                else {
                    if (response.data.link == '') {
                        this.setState({
                            profilePic: profile,
                            username: response.data.username
                        })
                    }
                    else {
                        this.setState({
                            profilePic: response.data.link,
                            username: response.data.username
                        })
                    }
                }
            })
    }

    render() {
        return (
            <div className='Navbar'>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <a className="navbar-brand" href="">
                        <img style={{ height: '40px', width: '40px' }} src={travel} alt="LetsTravel" />
                    </a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto" id='navbar-list'>
                            <li id='home-page' className="nav-item active">
                                <Link className="nav-link" aria-current="page" to="/home">Home</Link>
                            </li>
                            <li id='chat-page' className='nav-item'>
                                <Link className='nav-link' aria-current="page" to="/chat">Chat</Link>
                            </li>
                            <li id='contact-page' className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/contact">Contact Us</Link>
                            </li>
                            <li id='settings-page' className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/settings">Settings</Link>
                            </li>
                            <li id='profile-page' className="nav-item">
                                <Link className="nav-link" aria-current="page" to={'/profile/' + this.state.username}>
                                    <img src={this.state.profilePic} alt="Profile Pic" id='profile-navigation'
                                        style={{ height: '35px', width: '35px', borderRadius: "20px" }} />
                                </Link>
                            </li>
                        </ul>
                        <form className="form-inline my-2 my-lg-0" style={{marginRight: '3px'}}>
                            <input id='search-text' className="form-control mr-sm-2" type="search" placeholder="Search location" aria-label="Search" />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={(event) => this.initiateSearch(event)}>Search</button>
                        </form>
                        <button onClick={this.logOut}
                        style={{backgroundColor: 'transparent', 
                        border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold'}}>
                            Logout
                        </button>
                    </div>
                </nav>
            </div>
        )
    }
}

export function NavigateNavbar(props) {
    const navigate = useNavigate();
    return <Navbar page={props.page} navigate={navigate}></Navbar>
}
