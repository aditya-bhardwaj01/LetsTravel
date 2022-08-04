import React, { Component } from 'react'
import Navbar from "./Navbar";
import axios from "axios";
import swal from 'sweetalert';
import Comments, {NavigateProfileFromComment} from './Comments';
import profile from "../images/no-profile-pic.png";
import { useNavigate } from 'react-router-dom';
import Spinner from "./Spinner";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: [],
      loading: false
    }
  }

  async componentDidMount() {
    this.setState({loading: true})
    axios.post("http://localhost:3001/home",
      {
        accessToken: sessionStorage.getItem("accessToken")
      })
      .then((response) => {
        if (response.data.error) {
          this.setState({
            loading: false
          })
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
            posts: response.data,
            loading: false
          })
        }
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
    this.props.navigate("/profile/"+username);
  }

  render() {
    return (
      <div className='Home'>
        {
          this.state.loading ? <Spinner /> : ( <div>
          <Navbar page={'home-page'} />
          {this.state.posts.map((element) => {
            return (
              <div key={element.username} className="home-post">
                <div className="post-card">
                  <div className="card-body">
                    <h5>
                      <span onClick={() => this.goToProfile(element.username)}>
                        <img src={element.userimage == null ? profile : element.userimage} 
                        alt="Profile Image" style={{ height: '35px', width: '35px', borderRadius: "20px", margin: "0 5px", cursor: 'pointer' }} />
                      </span>
                      {element.username}
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
                    <NavigateProfileFromComment postId={element.id} getTime={this.getTime} goToProfile={this.goToProfile} />
                  </div>
                  <i className='post-date' style={{ color: 'grey' }}>
                    {this.getTime(element.date)}
                  </i>
                </div>
              </div>
            );
          })}
          </div>
          )
        }

      </div>
    )
  }
}

export function NavigateProfileFromHome(props) {
  const navigate = useNavigate();
  return (<Home navigate={navigate}></Home>)
}
