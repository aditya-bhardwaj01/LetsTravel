import React, { Component } from 'react'
import axios from "axios";
import swal from 'sweetalert';
import profile from "../images/no-profile-pic.png";
import { useNavigate } from 'react-router-dom';

export default class Comments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            showDelete: false,
            username: ""
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
        var newComment = document.getElementById('new-comment' + this.props.postId).value;
        if (newComment != '') {
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
                        document.getElementById('new-comment' + this.props.postId).value = '';
                        this.setState({
                            comments: response.data
                        })
                    }
                })
        }
    }

    clickButton = (e) => {
        var key = e.which;
        if (key === 13) {
            document.getElementById("postComment" + this.props.postId).click();
            return false;
        }
    }

    deleteComment = (commentId) => {
        axios
            .post("http://localhost:3001/home/comments/delete", {
                commentId: commentId,
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
                    document.getElementById('new-comment' + this.props.postId).value = '';
                    this.setState({
                        comments: response.data
                    })
                }
            })
    }

    componentDidMount() {
        axios
            .post("http://localhost:3001/profile/currProfile", {
                accessToken: sessionStorage.getItem("accessToken"),
            })
            .then((response) => {
                this.setState({ username: response.data });
            });

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
                    {this.state.comments.length == 0 ?
                        <p style={{ color: '#768080', textAlign: 'center' }}>No comments yet</p> : this.state.comments.map((element) => {
                            return <li className="comment-section list-group-item"
                                style={{ backgroundColor: this.props.backgroundcolor, color: this.props.textColor }} >
                                <span style={{ cursor: 'pointer' }} onClick={() => this.props.goToProfile(element.username)} id="profile-pic-comment">
                                    <img src={element.userimage == '' ? profile : element.userimage} alt="image" style={{ height: '35px', width: '35px', borderRadius: "20px" }} />
                                </span>
                                <span onClick={() => this.props.goToProfile(element.username)} style={{ color: this.props.textColor, marginLeft: '8px', cursor: 'pointer' }}>
                                    {element.username}
                                </span>
                                <span style={{ float: 'right', cursor: 'pointer', color: '#FD1C03', 
                                display: (this.props.ownProfile || element.username==this.state.username) ? 'inline' : 'none' }}
                                onClick={() => this.deleteComment(element.id)}>
                                    <i className="fa fa-trash-o"></i>
                                </span>
                                <br />
                                <span id="comment" style={{ color: this.props.textColor }}>{element.comment_text}</span>
                                <br />
                                <span style={{ color: 'grey' }} id="comment-time">{this.props.getTime(element.date)}</span>
                            </li>
                        })}
                    <li className="comment-section list-group-item"
                        style={{ backgroundColor: this.props.backgroundcolor, color: this.props.textColor }}>
                        <input style={{ padding: '0 8px' }} id={'new-comment' + this.props.postId} className='add-comment' type="text" placeholder='Add  comment...' onKeyDown={(event) => this.clickButton(event)} />
                        <span id={'postComment' + this.props.postId} onClick={this.addComment} style={{ marginLeft: '5px', fontSize: '18px', cursor: 'pointer', color: '#0999F6' }}>
                            Post
                        </span>
                    </li>
                </ul>
            </div>
        )
    }
}

export function NavigateProfileFromComment(props) {
    const navigate = useNavigate();
    return (<Comments backgroundcolor={props.backgroundcolor} textColor={props.textColor} goToProfile={props.goToProfile} postId={props.postId} getTime={props.getTime} navigate={navigate} ownProfile={props.ownProfile}></Comments>)
}
