import React, { Component } from 'react'
import Spinner from "./Spinner";
import { Link, useParams } from 'react-router-dom'
import swal from 'sweetalert';
import axios from "axios";
import Comments, { NavigateProfileFromComment } from './Comments';
import profile from "../images/no-profile-pic.png";
import noresult from "../images/noresult.svg"
import { useNavigate } from 'react-router-dom';
// import { NavigateNavbar } from './Navbar';

export default class SearchResult extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            loading: false,
            location: this.props.location,
            posts: []
        })
    }

    goToProfile = (username) => {
        this.props.navigate("/profile/" + username);
    }

    async componentDidMount() {
        this.setState({ loading: true })
        axios
            .post("http://localhost:3001/searchResult", {
                searchInput: this.state.location,
                accessToken: sessionStorage.getItem('accessToken')
            })
            .then((response) => {
                this.setState({ loading: false })
                this.setState({posts: response.data})
                console.log(typeof(response.data))
            })
    }

    displayLocation = (loc) => {
        var arr = loc.split(',');
        return arr;
    }

    getTime = (time) => {
        var date = new Date(time);
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        var hours = date.getHours();
        var minutes = date.getMinutes();
        return date.getDate() + ' ' + monthNames[date.getMonth()].slice(0, 3) + ' ' + date.getFullYear() + ' ' + hours + ':' + minutes;
    }

    goToProfile = (username) => {
        this.props.navigate("/profile/" + username);
    }

    async componentDidMount() {
        this.setState({ loading: true })
        axios
            .post("http://localhost:3001/searchResult", {
                searchInput: this.state.location
            })
            .then((response) => {
                if (response.data.error) {
                    swal({
                        title: "Opps!",
                        text: response.data.error,
                        icon: "error",
                        timer: 5000,
                        button: false,
                    });
                    this.setState({ loading: false })
                }
                else {
                    // console.log(response.data)
                    this.setState({
                        loading: false,
                        posts: response.data
                    })
                }
            })
    }

    render() {
        return (
            <div className='SearchResult'>
                {
                    this.state.loading ? <Spinner /> : (
                        <div>
                            <div className="back-btn">
                                <Link to="/home" className='backfrom-search'>
                                    &larr;Go to home
                                </Link>
                            </div>
                            {this.state.posts.length === 0 ? <p style={{ textAlign: "center", color: "gray", fontSize: '18px' }}>
                                Opps!! we cannot find any matches... <br />
                                <img src={noresult} alt="no result found" className='img-fluid' />
                            </p> : 
                            this.state.posts.map((element) => {
                                return (
                                    <div key={element.username} className="home-post">
                                        <div className="post-card">
                                            <div className="card-body">
                                                <h5>
                                                    <span onClick={() => this.goToProfile(element.username)}>
                                                        <img src={element.userimage == null ? profile : element.userimage}
                                                            alt="Profile Image" style={{ height: '35px', width: '35px', borderRadius: "20px", margin: "0 5px", cursor: 'pointer' }} />
                                                    </span>
                                                    <span onClick={() => this.goToProfile(element.username)} style={{ color: 'white', cursor: 'pointer' }}>{element.username}</span>
                                                </h5>
                                                <hr></hr>
                                                <h6 style={{ fontWeight: "bold" }} className="card-title">
                                                    {element.post_title}
                                                    {this.displayLocation(element.location).map((location) => {
                                                        return <span style={{ float: 'right', margin: '0 2px' }} className="badge badge-primary">{location}</span>
                                                    })}
                                                </h6>
                                                <p className="card-text">{element.post_text}</p>
                                            </div>
                                            <img className="card-img-top" src={element.post_images} alt="Card image cap" />
                                            <div className="card-body">
                                                <NavigateProfileFromComment textColor={"white"} backgroundcolor={"#313237"} postId={element.id} getTime={this.getTime} goToProfile={this.goToProfile} ownProfile={false} />
                                            </div>
                                            <i className='post-date' style={{ color: 'grey' }}>
                                                {this.getTime(element.date)}
                                            </i>
                                        </div>
                                    </div>
                                );
                            })
                            }
                            
                        </div>
                    )
                }

            </div>
        )
    }
}

export function NavigateSearchResult(props) {
    let { location } = useParams()
    const navigate = useNavigate()
    return <SearchResult location={location} navigate={navigate} />
}