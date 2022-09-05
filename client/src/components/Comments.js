import React, { Component } from 'react'
import axios from "axios";
import swal from 'sweetalert';
import profile from "../images/no-profile-pic.png";
import { useNavigate } from 'react-router-dom';

export default class Comments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: []
        }
    }

    toggleComment = (event, postId) => {
        event.preventDefault();
        if (event.target.innerHTML == 'View all comments') {
            event.target.innerHTML = 'Hide Comments';
            document.getElementById(postId).style.display = 'block';
        }
        else if (event.target.innerHTML == 'Hide Comments') {
            event.target.innerHTML = 'View all comments';
            document.getElementById(postId).style.display = 'none';
        }
    }

    addComment = () => {
        var newComment = document.getElementById('new-comment'+this.props.postId).value;
        if(newComment != ''){
            axios.post("http://localhost:3001/home/comments/post",
            {
                postId: this.props.postId,
                commentText: newComment,
                accessToken: sessionStorage.getItem("accessToken")
            })
            .then((response) => {
                if (response.data.error) {
                    swal({
                        title: "Error!",
                        text: response.data.error,
                        icon: "error",
                        timer: 5000,
                        button: false
                    });
                }
                else {
                    document.getElementById('new-comment'+this.props.postId).value = '';
                    this.setState({
                        comments: response.data
                    })
                }
            })
        }
    }

    clickButton = (e) => {
        var key = e.which;
        if(key === 13)  
        {
            document.getElementById("postComment").click();
            return false;  
        }
    }

    componentDidMount() {
        axios.post("http://localhost:3001/home/comments",
            {
                postId: this.props.postId
            })
            .then((response) => {
                if (response.data.error) {
                    swal({
                        title: "Error!",
                        text: response.data.error,
                        icon: "error",
                        timer: 5000,
                        button: false
                    });
                }
                else {
                    this.setState({
                        comments: response.data
                    })
                }
            })
    }

    render() {
        return (
            <div>
                <a href="#" onClick={(event) => this.toggleComment(event, this.props.postId)} className="card-link">
                    View all comments
                </a>
                <ul style={{ display: 'none' }} id={this.props.postId} className="list-group list-group-flush">
                    {this.state.comments.length==0 ? 
                    <p style={{color: '#768080', textAlign: 'center'}}>No comments yet</p> : this.state.comments.map((element) => {
                        return <li className="comment-section list-group-item">
                            <span style={{cursor: 'pointer'}} onClick={() => this.props.goToProfile(element.username)} id="profile-pic-comment">
                                <img src={element.userimage == '' ? profile:element.userimage} alt="image" style={{ height: '35px', width: '35px', borderRadius: "20px" }} />
                            </span>
                            <span onClick={() => this.props.goToProfile(element.username)} style={{color: 'white', marginLeft: '8px', cursor: 'pointer'}}>
                                {element.username}
                            </span>
                            <br />
                            <span id="comment" style={{color: 'white'}}>{element.comment_text}</span>
                            <br />
                            <span style={{color: 'grey'}} id="comment-time">{this.props.getTime(element.date)}</span>
                        </li>
                    })}
                    <li className="comment-section list-group-item">
                        <input style={{padding: '0 8px'}} id={'new-comment'+this.props.postId} className='add-comment' type="text" placeholder='Add  comment...' onKeyDown={(event) => this.clickButton(event)} />
                        <span id='postComment' onClick={this.addComment} style={{ marginLeft: '5px', fontSize: '18px', cursor: 'pointer', color: '#0999F6' }}>
                            Post
                        </span>
                    </li>
                </ul>
            </div>
        )
    }
}

export function NavigateProfileFromComment(props){
    const navigate = useNavigate();
    return (<Comments goToProfile = {props.goToProfile} postId = {props.postId} getTime = {props.getTime} navigate={navigate}></Comments>)
}
