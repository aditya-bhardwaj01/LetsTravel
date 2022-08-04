import React, { Component } from "react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";
import axios, { AxiosError } from "axios";
import swal from "sweetalert";
import profile from "../images/no-profile-pic.png";
import { image } from "cloudinary-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentProfile: [],
      imageSelected: "",
      profilePicture: "",
      newUploaded: false,
      skills: [],
      loading: false
    };
  }

  saveProfileImage = (imageUrl) => {
    axios
     .post("http://localhost:3001/settings/saveImage", {
      imageUrl: imageUrl,
      accessToken: sessionStorage.getItem("accessToken")
     }).then((response) => {
      if(response.data.error) {
        this.setState({loading: false})
        swal({
          title: "Error!",
          text: "Please check your connection or try after sometime!",
          icon: "error",
          timer: 8000,
          button: false,
        });
      } else {
        swal({
          title: "Updated successfully!",
          text: "Please refresh to see changes!",
          icon: "success",
          timer: 8000,
          button: false,
        });
        this.setState({loading: false})
      }
     })
  }

  uploadImage = () => {
    if (this.state.newUploaded) {
      this.setState({loading: true})
      const formData = new FormData();
      formData.append("file", this.state.imageSelected);
      formData.append("upload_preset", "d2u9oczt");

      axios
        .post("https://api.cloudinary.com/v1_1/dbcpdiy45/image/upload", formData)
        .then((response) => {
          this.saveProfileImage(response.data.secure_url)
        });
    }
  };

  async componentDidMount() {
    this.setState({ loading: true });
    axios
      .post("http://localhost:3001/settings", {
        accessToken: sessionStorage.getItem("accessToken"),
      })
      .then((response) => {
        if (response.data.error) {
          this.setState({
            loading: false,
          });
          swal({
            title: "Error!",
            text: response.data.error,
            icon: "error",
            timer: 5000,
            button: false,
          });
        } else {
          this.setState({
            currentProfile: response.data[0],
            profilePicture: response.data[0].profile_pic,
            loading: false,
          });
          if (response.data[0].skills != null) {
            this.setState({
              skills: response.data[0].skills.split(","),
            });
          }
        }
      });
  }

  render() {
    return (
      <div className="Settings">
        <Navbar page={"settings-page"} />
        {this.state.loading ? (
          <Spinner />
        ) : (
          <div className="setting-section">
            <div className="row setting-main">
              <div className="col-sm-4 setting-main-left">
                <div className="left-profile-picture">
                  <div className="image-display">
                    <img
                      src={
                        this.state.profilePicture == ""
                          ? profile
                          : this.state.profilePicture
                      }
                      id="output"
                      width="200"
                      height="200"
                    />
                  </div>
                  <div className="input-image">
                    <input
                      id="file-upload"
                      accept="image/*"
                      type="file"
                      onChange={(event) => {
                        const [file] = event.target.files;
                        this.setState({
                          imageSelected: event.target.files[0],
                          profilePicture: URL.createObjectURL(file),
                          newUploaded: true
                        });
                      }}
                    />
                    <p style={{ textAlign: "center" }}>
                      <label
                        style={{ marginTop: "10px" }}
                        htmlFor="file-upload"
                        className="custom-file-upload"
                      >
                        Edit photo
                      </label>
                    </p>
                  </div>

                  <div className="btn btn-success" onClick={this.uploadImage}>Save picture</div>
                </div>

                <div className="left-about">
                  <h5>About me</h5>
                  <p>
                    {this.state.currentProfile.about == null ? (
                      <p style={{ color: "gray" }}>Not provided</p>
                    ) : (
                      this.state.currentProfile.about
                    )}
                  </p>
                </div>

                <div className="left-skills">
                  <h5>Skills/Hobby</h5>
                  {this.state.skills.length <= 0 ? (
                    <p style={{ color: "gray" }}>Not provided</p>
                  ) : (
                    this.state.skills.map((element) => {
                      return (
                        <p
                          style={{
                            overflowY: "hidden",
                            fontWeight: "",
                            fontSize: "18px",
                          }}
                        >
                          {element[0].toUpperCase() + element.slice(1)}
                        </p>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="col-sm-8 setting-main-right">
                <div className="right-upper">
                  <h4 className="name-user">
                    {this.state.currentProfile.name}
                  </h4>

                  {this.state.currentProfile.profession == null ? (
                    <p style={{ color: "gray" }}>Profession not provided</p>
                  ) : (
                    <p
                      style={{
                        color: "#2575B4",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      {this.state.currentProfile.profession}
                    </p>
                  )}
                </div>

                <div className="right-lower">
                  <h4 style={{ color: "wheat" }}>About</h4>
                  <hr className="hr-about" />

                  <div className="right-lower-details">
                    <div className="row">
                      <div className="col-sm-6 nameOfAbout">User Id</div>
                      <div className="col-sm-6 detailOfAbout">
                        {this.state.currentProfile.username}
                      </div>

                      <div className="col-sm-6 nameOfAbout">Name</div>
                      <div className="col-sm-6 detailOfAbout">
                        {this.state.currentProfile.name}
                      </div>

                      <div className="col-sm-6 nameOfAbout">Email</div>
                      <div className="col-sm-6 detailOfAbout">
                        <i className="fas fa-envelope"></i>{" "}
                        {this.state.currentProfile.email}
                      </div>

                      <div className="col-sm-6 nameOfAbout">Phone</div>
                      <div className="col-sm-6 detailOfAbout">
                        <i className="fas fa-phone"></i>{" "}
                        {this.state.currentProfile.phone}
                      </div>

                      <div className="col-sm-6 nameOfAbout">Location</div>
                      <div className="col-sm-6 detailOfAbout">
                        {(this.state.currentProfile.city != null ||
                          this.state.currentProfile.country != null) && (
                            <i
                              className="fas fa-map-marker-alt"
                              style={{ marginRight: "8px" }}
                            ></i>
                          )}
                        {this.state.currentProfile.city == null &&
                          this.state.currentProfile.country != null &&
                          this.state.currentProfile.country}
                        {this.state.currentProfile.city != null &&
                          this.state.currentProfile.country == null &&
                          this.state.currentProfile.city}
                        {this.state.currentProfile.city != null &&
                          this.state.currentProfile.country != null &&
                          this.state.currentProfile.city +
                          ", " +
                          this.state.currentProfile.country}
                        {this.state.currentProfile.city == null &&
                          this.state.currentProfile.country == null && (
                            <p style={{ color: "gray" }}>Not provided</p>
                          )}
                      </div>
                      {/* Handle NULL values, upload photo */}

                      <div className="col-sm-6 nameOfAbout">Profession</div>
                      <div className="col-sm-6 detailOfAbout">
                        {this.state.currentProfile.profession != null && (
                          <i
                            className="fa-solid fa-briefcase"
                            style={{ marginRight: "8px" }}
                          ></i>
                        )}
                        {this.state.currentProfile.profession != null &&
                          this.state.currentProfile.profession}
                        {this.state.currentProfile.profession == null && (
                          <p style={{ color: "gray" }}>Not provided</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="edit-button-area">
                  <button type="button" className="btn btn-dark" data-toggle="modal" data-target=".bd-example-modal-lg">
                    Edit details
                  </button>

                  <div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">

                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="edit-form">
                          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem ex sequi veritatis repellendus quis
                            laborum explicabo nemo ut rerum. In ducimus, ad est blanditiis facere ut vero dolorem fugit ipsum.
                          </p>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                          <button type="button" className="btn btn-success">Save changes</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
