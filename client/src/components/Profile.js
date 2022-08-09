import React, { Component } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";
import axios, {AxiosError} from "axios";

export default class Profile extends Component {

  constructor(props){
    super(props);
    this.state = {
      profile: [],
      posts: []
    }
  }

  async componentDidMount() {
    axios.post("", {
      
    })
  }

  render() {
    return (
      <div className="Profile">
        <Navbar page={"profile-page"} />
        <div className="profile-section">
          <div className="profile-top-section">
            <div className="row">
              <div className="profile-top-left col-sm-4">
                <span className="user-image">image</span>
                <span className="username-button">username-button</span>
              </div>
              <div className="profile-top-right col-sm-8">
                detail
              </div>
            </div>
          </div>

          <div className="profile-bottom-section">posts</div>
        </div>
        {/* {this.state.loading ? (
          <Spinner />
        ) : (
          <div></div>
        )} */}
      </div>
    );
  }
}
