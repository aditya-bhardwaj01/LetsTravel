import React, { Component } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";
import axios, { AxiosError } from "axios";
import swal from "sweetalert";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownProfile: false,
      username: this.props.username,
      profile: "",
      posts: "",
      loading: false,
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    axios
    .post("http://localhost:3001/profile/currProfile", {
      accessToken: sessionStorage.getItem("accessToken")
    })
    .then((response) => {
      if(response.data === this.state.username){
        this.setState({ownProfile: true});
      }
    })

    axios
      .post("http://localhost:3001/profile", {
        username: this.state.username,
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
          });
        } else {
          this.setState({
            posts: response.data.posts,
            profile: response.data.profile[0],
          });
        }
      });
  }

  render() {
    return (
      <div className="Profile">
        <Navbar page={"profile-page"} />
        {this.state.loading ? (
          <Spinner />
        ) : (
          <div className="profile-section">
            <div className="profile-top-section">
              <div className="row">
                <div className="profile-top-left col-sm-4">
                  <img
                    style={{ cursor: 'pointer' }}
                    className="img-fluid"
                    src={this.state.profile.profile_pic}
                    alt="Profile pic"
                  />
                </div>
                <div className="profile-top-right col-sm-8">
                  <p className="username-button">
                    <span>{this.state.profile.username}</span>
                    {this.state.ownProfile && <Link
                      to="/settings"
                      type="button"
                      className="btn btn-outline-light"
                    >
                      Edit profile
                    </Link>}
                  </p>
                  <p className="name-right">{this.state.profile.name}</p>
                  <p
                    style={{
                      color: "#2575B4",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {this.state.profile.profession}
                  </p>
                  <p className="about-right">
                    {this.state.profile.about}
                  </p>
                </div>
              </div>
            </div>

            <div className="profile-bottom-section">
              post
            </div>
          </div>
        )}
      </div>
    );
  }
}

export function NavigateProfile(props) {
  let { username } = useParams();
  console.log(username);
  return <Profile username={username}></Profile>;
}
