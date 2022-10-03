import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { image } from "cloudinary-react";
import axios, { AxiosError } from "axios";
import dropimage from "../images/drop-image.jpg";

export default class AddPost extends Component {
  constructor(props){
    super(props);
    this.state ={
      postImage: "",
      postImageSelected: ""
    }
  }

  savePostData = async (imageUrl, formData) => {
    axios
      .post("http://localhost:3001/profile/addPost", {
        imageUrl: imageUrl,
        formData: formData,
        accessToken: sessionStorage.getItem("accessToken")
      }).then((response) => {
        console.log(response.data.posts)
        this.props.updatePost(response.data.posts)
      })
  }

  uploadImage = async (data) => {
    const formData = new FormData();
    formData.append("file", this.state.postImageSelected);
    formData.append("upload_preset", "d2u9oczt");

    axios
      .post("https://api.cloudinary.com/v1_1/dbcpdiy45/image/upload", formData)
      .then((response) => {
        this.savePostData(response.data.secure_url, data);
      });
  };

  initialValues = {
    posttitle: "",
    posttext: "",
    postlocation: ""
  }

  validationSchema = Yup.object().shape({
    //postImage: Yup.mixed().required("Please upload a picture"),
    posttitle: Yup.string().required("Required field"),
    posttext: Yup.string().required("Required field"),
    postlocation: Yup.string().required("Required field")
  })

  onSubmit = async (data) => {
    await this.uploadImage(data);
    document.getElementById('closeAddPost').click();
    //window.location.reload()
  }

  render() {
    return (
      <div className="AddPost">
        <div className="app-post-btn">
          <button
            type="button"
            className="btn btn-small btn-outline-light"
            data-toggle="modal"
            data-target=".bd-example-modal-lg"
          >
            Create post +
          </button>

          <div
            className="modal fade bd-example-modal-lg"
            id="addPost"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            //style={{ color: "black" }}
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel" style={{color: "black"}}>
                    Share your experience!
                  </h5>
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

                  <Formik
                    initialValues={this.initialValues}
                    onSubmit={this.onSubmit}
                    validationSchema={this.validationSchema}
                  >
                    <Form className="add-post-form">

                      <div className="post-image-section" style={{textAlign: "center"}}>
                        <div className="post-image-display" >
                          <img
                            src={this.state.postImage === "" ? dropimage : this.state.postImage}
                            id="output"
                            width="200"
                            height="200"
                            className="img-fluid"
                          />
                          <p style={{fontSize: '14px', color: 'black', padding: '1em', fontStyle: 'italic', color: 'red'}}>
                  If the size of your picture is high then the post will not be created.
                </p>
                        </div>
                        <div className="post-image-input" style={{marginTop: "10px"}}>
                          <input
                            name="postImage"
                            id="postImage"
                            accept="image/*"
                            type="file"
                            onChange={(event) => {
                              const [file] = event.target.files;
                              this.setState({
                                postImageSelected: event.target.files[0],
                                postImage: URL.createObjectURL(file)
                              });
                            }} 
                            required
                          />
                          <p>
                            <label
                              className="btn btn-info" 
                              htmlFor="postImage"
                            >
                              Add picture
                            </label>
                          </p>
                        </div>
                        <ErrorMessage name="postImage" component="span" />
                      </div>

                      <Field 
                      className="postfield"
                      name="posttitle"
                      id="posttitle"
                      type="text"
                      placeholder="Add title for your post"
                      />
                      <ErrorMessage name="posttitle" component="span" />

                      <Field
                      as="textarea"
                      className="postfield"
                      name="posttext"
                      id="posttext"
                      type="text"
                      placeholder="So how was your trip??"
                      />
                      <ErrorMessage name="posttext" component="span" />

                      <Field
                      className="postfield"
                      name="postlocation"
                      id="postlocation"
                      type="text"
                      placeholder="Give your trip locations seperated by commas"
                      />
                      <ErrorMessage name="postlocation" component="span" />
                      
                    <button type='submit' className="btn btn-success btn-lg btn-block">Create</button>
                    </Form>
                  </Formik>
                </div>
                <div className="modal-footer">
                  <button
                    id="closeAddPost"
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
      </div>
    );
  }
}
