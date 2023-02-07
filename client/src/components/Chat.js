import axios from 'axios';
import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import profile from "../images/no-profile-pic.png";
import envelope from '../images/envelope.png';
import { NavigateNavbar } from './Navbar';
import Spinner from './Spinner';
import chatLoad from '../images/chat_load.gif';

class Chat extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentContact: "",
            currentContactUsername: "",
            currentContactProfilePic: "",
            myusername: "",
            loading: false,
            friends: [],
            messages: [],
            searchResult: []
        }
    }

    clickSend = (e) => {
        var key = e.which;
        if (key === 13) {
            this.sendMessage();
            return false;
        }
    }

    sendMessage = () => {
        var newMsg = document.getElementById('msg-to-send').value;
        document.getElementById('msg-to-send').value = '';
        axios
            .post('http://localhost:3001/chatResult/addMessage', {
                accessToken: sessionStorage.getItem('accessToken'),
                receiverId: this.state.currentContact,
                newMessage: newMsg
            })
            .then((response) => {
                if (response.data.error) {
                    swal({
                        title: "Error!",
                        text: response.data.error,
                        icon: "error",
                        timer: 5000,
                        button: false
                    })
                }
                else {
                    this.setState({
                        messages: response.data.messages,
                        friends: response.data.details
                    })
                }
            })
        var objDiv = document.getElementById("msg-displaying");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    fetchMessages = (contactId) => {
        document.getElementById('chat-load-gif' + contactId).getElementsByTagName('img')[0].style.display = 'inline';
        this.setState({ currentContact: contactId })
        axios
            .post('http://localhost:3001/chatResult/message', {
                accessToken: sessionStorage.getItem('accessToken'),
                contactId: contactId
            })
            .then((response) => {
                document.getElementById('chat-load-gif' + contactId).getElementsByTagName('img')[0].style.display = 'none';
                if (response.data.error) {
                    swal({
                        title: "Error!",
                        text: response.data.error,
                        icon: "error",
                        timer: 5000,
                        button: false
                    })
                } else {
                    this.setState({
                        currentContactUsername: response.data.contactUsername,
                        currentContactProfilePic: response.data.contactProfilepic,
                        messages: response.data.messages
                    })
                }
            })
    }

    searchResult = (event) => {
        var searchedText = event.target.value
        var searchShow = document.getElementById('search-show-out')
        if (searchedText !== "") searchShow.style.display = 'block';
        else searchShow.style.display = 'none';

        axios
            .post('http://localhost:3001/chatResult/searchResult', {
                searchedText: searchedText,
                accessToken: sessionStorage.getItem('accessToken')
            })
            .then((response) => {
                const toShow = [];
                const usernames = [];
                this.state.friends.forEach(element => {
                    usernames.push(element.username)
                });
                response.data.results.forEach(user => {
                    if (!usernames.includes(user.username)) toShow.push(user)
                });

                this.setState({
                    searchResult: toShow
                })
            })
    }

    goToProfile = (username) => {
        this.props.navigate("/profile/" + username);
    }

    addContacts = (id) =>{
        document.getElementById('search-show-out').style.display = 'none';
        axios
            .post('http://localhost:3001/chatResult/addContacts', {
                contactId: id,
                accessToken: sessionStorage.getItem('accessToken')
            })
            .then((response) => {
                if(response.data.error){
                    console.log(response.data.error)
                }
                else{
                    this.setState({
                        currentContactUsername: response.data.contactUsername,
                        currentContactProfilePic: response.data.contactProfilepic,
                        messages: response.data.messages,
                        friends: response.data.details
                    })
                }
            })
    }

    async componentDidMount() {
        this.setState({ loading: true })
        axios
            .post('http://localhost:3001/chatResult/contacts', {
                accessToken: sessionStorage.getItem('accessToken')
            })
            .then((response) => {
                this.setState({ loading: false });
                if (response.data.error) {
                    swal({
                        title: "Error!",
                        text: response.data.error,
                        icon: "error",
                        timer: 5000,
                        button: false,
                    })
                } else {
                    //console.log(response.data)
                    this.setState({
                        friends: response.data.details,
                        myusername: response.data.myusername
                    })
                }
            })
    }

    render() {
        return (
            <div className="Chat">
                {
                    this.state.loading ? <Spinner /> : (<div>
                        <NavigateNavbar page={'chat-page'} />

                        <div className='friendList row'>
                            <div className="col-5 friendList-left">
                                <div id='searchContact'>
                                    <input type="text" placeholder='&#x1F50D;Search' onChange={this.searchResult} />
                                </div>
                                <div id="search-show-out">
                                    {
                                        this.state.searchResult.map((result) => {
                                            return <div id="search-show">
                                                <div className="row">
                                                    <div className="col-sm-8" style={{ textAlign: 'left' }}>
                                                        <img className='img-fluid' src={result.profile_pic === "" ? profile : result.profile_pic} alt="Profile pic" />
                                                        {result.username}
                                                    </div>
                                                    <div className="col-sm-4" style={{ textAlign: 'right' }}>
                                                        <button className="button-29" role="button" onClick={() => this.addContacts(result.id)}>
                                                            Say Hi!
                                                        </button>
                                                    </div>
                                                </div>
                                                <hr style={{ backgroundColor: 'white' }} />
                                            </div>
                                        })
                                    }
                                </div>
                                {this.state.friends.length === 0 ?
                                    <div className='no-contact-history'>
                                        No contact history
                                    </div>
                                    :
                                    <div>
                                        {this.state.friends.map((element) => {
                                            return <div id="friend-single" onClick={() => this.fetchMessages(element.person2)}>
                                                <span id='friend-single-image'>
                                                    <img src={element.profile_pic === "" ? profile : element.profile_pic} alt="Profile pic" />
                                                </span>
                                                <span id='friend-single-username'>
                                                    {element.username}
                                                    <span id={"chat-load-gif" + element.person2} className='img-fluid'>
                                                        <img
                                                            style={{ height: '20px', width: '20px', marginLeft: '5px', display: 'none' }}
                                                            src={chatLoad} alt="Loading Chat" />
                                                    </span>
                                                </span>
                                            </div>
                                        })}
                                    </div>
                                }

                            </div>

                            <div className="col-7 friendList-right"
                                style={this.state.messages.length === 0 ?
                                    { display: 'flex', justifyContent: 'center', alignItems: 'center' } :
                                    {}}>
                                {
                                    this.state.messages.length === 0 ?
                                        <div id='msg-will-appear'>
                                            <p id='msg-will-appear-img'>
                                                <img src={envelope} alt='Messages' />
                                            </p>
                                            <p id="msg-will-appear-text">
                                                Your messages will appear here
                                            </p>
                                        </div>
                                        :
                                        <div id='msg-shown'>
                                            <div id="contactheader">
                                                <img
                                                    src={this.state.currentContactProfilePic === '' ? profile : this.state.currentContactProfilePic}
                                                    alt='Profile Pic'
                                                    onClick={() => this.goToProfile(this.state.currentContactUsername)}
                                                />
                                                <span id="contactheader-name">
                                                    {this.state.currentContactUsername}
                                                </span>
                                            </div>
                                            <hr style={{ backgroundColor: 'grey', width: '100%' }} />
                                            <div id="msg-displaying">
                                                {this.state.messages.map((element) => {
                                                    return <div id="msg-single"
                                                        style={this.state.myusername === element.username ?
                                                            { textAlign: 'right' } : { textAlign: 'left' }}
                                                    >
                                                        {this.state.myusername === element.username ?
                                                            <p id='msg-span'>
                                                                <p style={{marginRight: '5px'}}>{element.message}</p>
                                                                <img src={element.profile_pic === '' ? profile : element.profile_pic} alt='Profile pic'
                                                                    onClick={
                                                                        () => 
                                                                        this.goToProfile(
                                                                            this.state.myusername === element.username ? 
                                                                            this.state.myusername :
                                                                            this.state.currentContactUsername
                                                                        )
                                                                    }
                                                                />
                                                            </p> :
                                                            <p id='msg-span'>
                                                                <img src={element.profile_pic === '' ? profile : element.profile_pic} alt='Profile pic'
                                                                    onClick={
                                                                        () => 
                                                                        this.goToProfile(
                                                                            this.state.myusername === element.username ? 
                                                                            this.state.myusername :
                                                                            this.state.currentContactUsername
                                                                        )
                                                                    }
                                                                />
                                                                <p style={{marginLeft: '5px'}}>{element.message}</p>
                                                            </p>}

                                                    </div>
                                                })}
                                            </div>
                                            <div id="type-msg-section">
                                                <input type="text" placeholder='Message' id='msg-to-send' onKeyDown={(event) => this.clickSend(event)} />
                                                <span type="button" className="btn btn-info btn-sm" onClick={this.sendMessage}>
                                                    <i className="fa fa-paper-plane" aria-hidden="true"></i>
                                                </span>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>

                    </div>)
                }
            </div>
        )
    }
}

export function NavigateChat(props) {
    const navigate = useNavigate();
    return <Chat navigate={navigate} />
}