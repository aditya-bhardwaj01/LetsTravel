import React, { Component } from "react";
import Navbar, {NavigateNavbar} from "./Navbar";
import Spinner from "./Spinner";
import axios, { AxiosError } from "axios";
import swal from "sweetalert";
import profile from "../images/no-profile-pic.png";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import AddPost from "./AddPost";
import Comments, {NavigateProfileFromComment} from './Comments';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownProfile: false,
      username: this.props.username,
      profile: "",
      posts: [],
      loading: false,
    };
  }

  getTime = (time) => {
    var date = new Date(time);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return (
      date.getDate() +
      " " +
      monthNames[date.getMonth()].slice(0, 3) +
      " " +
      date.getFullYear() +
      " " +
      hours +
      ":" +
      minutes
    );
  };

  displayLocation = (loc) => {
    var arr = loc.split(",");
    return arr;
  };

  deletePost = (postId) => {
    swal({
      title: "Are you sure?",
      text: "This post will be permanantly removed from your profile!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.setState({ loading: true });
        axios
          .post("http://localhost:3001/profile/deletePost", {
            accessToken: sessionStorage.getItem("accessToken"),
            postId: postId,
          })
          .then((response) => {
            this.setState({ loading: false });
            if (response.data.error) {
              swal({
                title: "Could not delete post!",
                text: response.data.error,
                icon: "error",
                timer: 5000,
                button: false,
              });
            } else {
              this.setState({
                posts: response.data.posts,
              });
              swal("Poof! Your post has been deleted!", {
                icon: "success",
              });
            }
          });
      }
    });
  };

  updatePost = (data) => {
    window.location.reload()
  }

  async componentDidMount() {
    this.setState({ loading: true });
    axios
      .post("http://localhost:3001/profile/currProfile", {
        accessToken: sessionStorage.getItem("accessToken"),
      })
      .then((response) => {
        if (response.data === this.state.username) {
          this.setState({ ownProfile: true });
        }
      });

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
      <div className="Profile" >
        <NavigateNavbar page={"profile-page"} />
        {this.state.loading ? (
          <Spinner />
        ) : (
          <div className="profile-section">
            <div className="profile-top-section">
              <div className="row">
                <div className="profile-top-left col-sm-4">
                  <img
                    style={{ cursor: "pointer" }}
                    className="img-fluid"
                    src={
                      this.state.profile.profile_pic === ""
                        ? profile
                        : this.state.profile.profile_pic
                    }
                    alt="Profile pic"
                  />
                </div>
                <div className="profile-top-right col-md-8">
                  <p className="username-button">
                    <span>{this.state.profile.username}</span>
                    {this.state.ownProfile && (
                      <Link
                        to="/settings"
                        type="button"
                        className="btn btn-small btn-outline-light"
                      >
                        Edit profile
                      </Link>
                    )}
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
                  <p className="about-right">{this.state.profile.about}</p>
                </div>
              </div>
            </div>

            <hr style={{ backgroundColor: "gray" }}></hr>

            <div className="profile-bottom-section" style={{ padding: 0 }}>
              {this.state.ownProfile &&
                <AddPost updatePost={this.updatePost} />
              }

              {this.state.posts.length <= 0 ? (
                <p style={{ textAlign: "center", color: "gray" }}>
                  No posts yet
                </p>
              ) : (
                <div className="row">
                  {this.state.posts.map((element) => {
                    return (
                      <div className="col-lg-4 single-post">
                        <div className="card post-card-profile">
                          <h5>
                            <span>
                              <img
                                src={
                                  element.userimage == ""
                                    ? profile
                                    : element.userimage
                                }
                                alt="Profile Image"
                                style={{
                                  height: "35px",
                                  width: "35px",
                                  borderRadius: "20px",
                                  margin: "0 5px",
                                  cursor: "pointer",
                                }}
                              />
                            </span>
                            <span
                              style={{
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "lighter",
                                fontSize: "16px",
                              }}
                            >
                              {element.username}
                            </span>
                          </h5>
                          <p>
                            {this.displayLocation(element.location).map(
                              (location) => {
                                return (
                                  <span
                                    style={{ margin: "0 2px" }}
                                    className="badge badge-primary"
                                  >
                                    {location}
                                  </span>
                                );
                              }
                            )}
                          </p>
                          <img
                            className="card-img-top"
                            src={element.post_images}
                            alt="Post "
                          />
                          <div className="card-body">
                            <h5 className="card-title">{element.post_title}</h5>
                            <p className="card-text">
                              {element.post_text.slice(0, 100)}...
                            </p>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              data-toggle="modal"
                              data-target={"#seepost" + element.id}
                            >
                              View Post
                            </button>
                            &nbsp;
                            {this.state.ownProfile && (
                              <span>
                                <button
                                  onClick={() => this.deletePost(element.id)}
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                >
                                  Delete
                                </button>
                              </span>
                            )}
                            <div
                              className="modal fade"
                              id={"seepost" + element.id}
                              tabIndex="-1"
                              role="dialog"
                              style={{ color: "black" }}
                              aria-labelledby={"seepostLabel" + element.id}
                              aria-hidden="true"
                            >
                              <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5
                                      className="modal-title"
                                      id="seepostLabel"
                                    >
                                      {element.post_title}
                                    </h5>
                                    <br></br>
                                    <button
                                      type="button"
                                      className="close"
                                      data-dismiss="modal"
                                      aria-label="Close"
                                    >
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                  <div className="modal-body">
                                    <p>
                                      {this.displayLocation(
                                        element.location
                                      ).map((location) => {
                                        return (
                                          <span
                                            style={{ margin: "0 2px" }}
                                            className="badge badge-primary"
                                          >
                                            {location}
                                          </span>
                                        );
                                      })}
                                    </p>
                                    <img
                                      style={{ width: "100%" }}
                                      src={element.post_images}
                                      alt="Post Image"
                                    />
                                    <p className="post-text-modal">
                                      {element.post_text}
                                    </p>
                                    
                                    <NavigateProfileFromComment postId={element.id} getTime={this.getTime} textColor={"black"} backgroundcolor={"white"} ownProfile={true} />
                                    {/* goToProfile={this.goToProfile} /> */}
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-secondary"
                                      data-dismiss="modal"
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <i style={{ color: "grey", padding: "0 1em" }}>
                            {this.getTime(element.date)}
                          </i>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export function NavigateProfile(props) {
  let { username } = useParams();
  return <Profile username={username}></Profile>;
}
